import { IMeetiRepository, meetiRepository } from "./MeetiRepository";
import { MeetiInput } from "../schemas/meetiSchema";
import { User } from "better-auth";
import {
  communityRepository,
  ICommunityRepository,
} from "../../comminities/services/CommunityRepository";
import { CommunityPolicy } from "../../comminities/policies/CommunityPolicy";
import { MeetiPolicy } from "../policy/MeetiPolicy";
import {
  IMeetiAttendeesRepository,
  meetiAttendeesRepository,
} from "./MeetiAttendeesRepository";
import { MeetiAttendeePolicy } from "../policy/MeetiAttendeesPolicy";
import { deleteUTPFiles } from "@/src/lib/uploadthing-server";

class MeetiService {
  constructor(
    private meetiRepository: IMeetiRepository,
    private communityRepository: ICommunityRepository,
    private meetiAttendeesRepository: IMeetiAttendeesRepository,
  ) {}
  async createMeeti(data: MeetiInput, user: User) {
    const community = await this.communityRepository.findById(data.communityId);
    if (!community || !CommunityPolicy.isAdmin(user, community)) {
      throw new Error("No tienes permisos");
    }

    await this.meetiRepository.insert({ ...data, createdBy: user.id });
  }

  async getUpcomingMeetisByUser(user: User) {
    const upcomingMeetis = await this.meetiRepository.findUpcomingByUserId(
      user.id,
    );

    const enriched = await Promise.all(
      upcomingMeetis.map(async (meeti) => {
        const attendanceCount =
          await this.meetiAttendeesRepository.findAttendeesCount(meeti.id);
        return {
          data: meeti,
          attendanceCount,
          context: {
            isAdmin: MeetiPolicy.isAdmin(user, meeti),
          },
          permissions: {
            canViewAttendes: MeetiPolicy.canViewAttendes(user, meeti),
            canEdit: MeetiPolicy.canEdit(user, meeti),
            canDelet: MeetiPolicy.canDelete(user, meeti),
          },
        };
      }),
    );
    return enriched;
  }
  async getUpcomming() {
    return await meetiRepository.findUpcoming();
  }
  async getMeetiById(meetiId: string) {
    const meeti = await this.meetiRepository.findById(meetiId);
    if (!meeti) throw new Error("Meeti no encomtrado");

    return meeti;
  }
  async getMeetiWithPermissions(meetiId: string, user: User) {
    const meeti = await this.getMeetiById(meetiId);
    return {
      data: meeti,
      context: {
        isAdmin: MeetiPolicy.isAdmin(user, meeti),
      },
      permissions: {
        canViewAttendes: MeetiPolicy.canViewAttendes(user, meeti),
        canEdit: MeetiPolicy.canEdit(user, meeti),
        canDelete: MeetiPolicy.canDelete(user, meeti),
      },
    };
  }
  async getMeetiWithDetails(meetiId: string, user?: User) {
    const meeti = await meetiRepository.findFullById(meetiId);
    if (!meeti) throw new Error("Meeti no encontrado");
    const isPastMeeti = MeetiPolicy.isPastMeeti(meeti);

    if (!user) {
      return {
        data: meeti,
        context: {
          isAdmin: false,
          isPastMeeti,
          isAttending: false,
        },
        permissions: null,
      };
    }

    const isAttending = await this.meetiAttendeesRepository.isUserAttendees(
      user.id,
      meeti?.id,
    );

    const isAdmin = MeetiPolicy.isAdmin(user, meeti);

    return {
      data: meeti,
      context: {
        isAdmin,
        isPastMeeti,
        isAttending,
      },
      permissions: {
        canConfirm: MeetiAttendeePolicy.canConfirm(user, meeti, isAttending),
        canCancel: MeetiAttendeePolicy.canCancel(user, meeti, isAttending),
      },
    };
  }
  async updateMeeti(meetiId: string, data: MeetiInput, user: User) {
    const community = await this.communityRepository.findById(data.communityId);
    if (!community || !CommunityPolicy.isAdmin(user, community)) {
      throw new Error("No tienes permisos");
    }

    const meeti = await this.getMeetiWithPermissions(meetiId, user);

    if (!meeti.permissions.canEdit) {
      throw new Error("No autorizado");
    }
    await this.meetiRepository.update(
      { ...data, createdBy: user.id },
      meeti.data.id,
    );
  }
  async getMeetiAttendees(meetiId: string, user: User) {
    const meeti = await this.getMeetiById(meetiId);

    if (!MeetiPolicy.canViewAttendes(user, meeti)) {
      throw new Error("No autorizado");
    }

    const attendees =
      await this.meetiAttendeesRepository.findAttendeesByMeetiId(meeti.id);
    return {
      meeti,
      attendees,
    };
  }
  async getMeetisByCategory(categoryId: string) {
    return await meetiRepository.findByCategory(categoryId);
  }

  async deleteMeeti(meetiId: string, user: User) {
    // Obtener el Meeti
    const meeti = await this.getMeetiById(meetiId);

    // revisar permisos
    if (!MeetiPolicy.canDelete(user, meeti)) {
      throw new Error("No tienes permisos para eliminar");
    }
    // Eliminar
    await meetiRepository.delete(meetiId);
    await deleteUTPFiles(meeti.image);

    return {
      error: "",
      success: "Meeti eliminado correctamente",
    };
  }
}

export const meetiService = new MeetiService(
  meetiRepository,
  communityRepository,
  meetiAttendeesRepository,
);

