import {
  uuid,
  pgTable,
  text,
  timestamp,
  pgEnum,
  index,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const roleEnum = pgEnum("Role", ["USER", "ADMIN"]);

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),

  username: varchar({ length: 255 }).notNull().unique(),

  password: varchar({ length: 255 }).notNull(),

  role: roleEnum().default("USER").notNull(),

  createdAt: timestamp({ precision: 6, withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp({ precision: 6, withTimezone: true })
    .notNull()
    .$onUpdate(() => new Date()),
});

export const userInsertSchema = createInsertSchema(users, {
  username: (schema) =>
    schema.min(3, "Username must be atleast 3 characters long"),
  password: (schema) =>
    schema.min(6, "Password must be atleast 6 characters long"),
});
