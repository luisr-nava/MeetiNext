import { db } from "@/src/db";
import {
  FullMeeti,
  InsertMeeti,
  InsertMeetiLocation,
  SelectCategory,
  SelectMeeti,
} from "../types/meeti.type";
import { category, meeti, meetiLocations } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { format } from "date-fns";

export interface IMeetiRepository {
  insert(data: InsertMeeti): Promise<void>;
  findUpcomingByUserId(userId: string): Promise<SelectMeeti[]>;
  findUpcoming(): Promise<SelectMeeti[]>;
  findById(id: string): Promise<SelectMeeti | null>;
  update(data: InsertMeeti, meetiId: string): Promise<void>;
  findFullById(id: string): Promise<FullMeeti | null>;
  findUpcomimgByCommunity(communityId: string): Promise<SelectMeeti[]>;
  findByCategory(categoryId: string): Promise<SelectMeeti[]>;
  delete(meetiId: string): Promise<void>;
}
class MeetiRepository implements IMeetiRepository {
  async insert(data: InsertMeeti) {
    const [insertedMeeti] = await db.insert(meeti).values(data).returning();

    if (!insertedMeeti.virtual && data.location) {
      await db.insert(meetiLocations).values({
        meetiId: insertedMeeti.id,
        ...data.location,
      });
    }
  }

  async insertLocation(data: InsertMeetiLocation) {
    await db.insert(meetiLocations).values(data);
  }
  async findUpcomingByUserId(userId: string): Promise<SelectMeeti[]> {
    const today = format(new Date(), "yyyy-MM-dd");

    const result = await db.query.meeti.findMany({
      where: {
        AND: [{ createdBy: { eq: userId } }, { date: { gte: today } }],
      },
      orderBy: {
        date: "asc",
      },
    });

    return result;
  }
  async findUpcoming() {
    const now = new Date();
    const nowDate = now.toISOString().slice(0, 10);
    const nowTime = now.toTimeString().slice(0, 5);

    const result = await db.query.meeti.findMany({
      where: {
        OR: [
          { date: { gt: nowDate } },
          {
            AND: [{ date: { eq: nowDate } }, { time: { gte: nowTime } }],
          },
        ],
      },
      orderBy: {
        date: "asc",
        time: "asc",
      },
      limit: 3,
    });

    return result;
  }
  async findById(id: string) {
    const result = await db.query.meeti.findFirst({
      where: {
        id,
      },
      with: {
        location: true,
      },
    });
    return result ?? null;
  }
  async findFullById(id: string) {
    const result = await db.query.meeti.findFirst({
      where: {
        id,
      },
      with: {
        location: true,
        category: true,
        community: true,
        admin: true,
      },
    });
    return result ?? null;
  }

  async update(data: InsertMeeti, meetiId: string) {
    const [updateMeeti] = await db
      .update(meeti)
      .set(data)
      .where(eq(meeti.id, meetiId))
      .returning();
    // Actualizar ubicación si el evento es precencial

    if (!updateMeeti.virtual && data.location) {
      const locationExist = await db.query.meetiLocations.findFirst({
        where: {
          meetiId: updateMeeti.id,
        },
      });

      if (locationExist) {
        await db
          .update(meetiLocations)
          .set(data.location)
          .where(eq(meetiLocations.meetiId, updateMeeti.id));
      } else {
        await this.insertLocation({
          meetiId: updateMeeti.id,
          ...data.location,
        });
      }
    }
  }
  async findUpcomimgByCommunity(communityId: string) {
    const today = format(new Date(), "yyyy-MM-dd");
    return db.query.meeti.findMany({
      where: {
        communityId,
        date: {
          gte: today,
        },
      },
      limit: 3,
      orderBy: {
        date: "asc",
      },
    });
  }
  async findByCategory(categoryId: string): Promise<SelectMeeti[]> {
    const today = format(new Date(), "yyyy-MM-dd");

    const result = await db.query.meeti.findMany({
      where: {
        categoryId,
        date: {
          gte: today,
        },
      },
      orderBy: {
        date: "asc",
      },
      limit: 10,
    });

    return result;
  }
  async delete(meetiId: string): Promise<void> {
    await db.delete(meeti).where(eq(meeti.id, meetiId));
  }
}

export const meetiRepository = new MeetiRepository();

