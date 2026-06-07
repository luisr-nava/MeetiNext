// import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const community = pgTable("communities", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", {
    length: 255,
  }).notNull(),
  description: text("description").notNull(),
  image: varchar("image", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  createdBy: text("created_by").notNull(),
});

// type InsertCommunity = InferInsertModel<typeof community>;
// type SelectCommunity = InferSelectModel<typeof community>;

export const communityMembers = pgTable("community_members", {
  communityId: uuid("community_id")
    .references(() => community.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  joinedAt: timestamp("joined_at").defaultNow(),
});

