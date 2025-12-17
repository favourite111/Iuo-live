import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = ["admin", "lecturer", "student"] as const;
export type UserRole = typeof userRoleEnum[number];

export const classStatusEnum = ["scheduled", "live", "ended", "cancelled"] as const;
export type ClassStatus = typeof classStatusEnum[number];

export const classes = pgTable("classes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  lecturerId: varchar("lecturer_id").notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  duration: integer("duration").default(60),
  status: text("status").default("scheduled").notNull(),
  roomCode: varchar("room_code").unique(),
  recordingUrl: text("recording_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertClassSchema = createInsertSchema(classes).omit({
  id: true,
  createdAt: true,
  roomCode: true,
  recordingUrl: true,
});
export type InsertClass = z.infer<typeof insertClassSchema>;
export type Class = typeof classes.$inferSelect;

export const enrollments = pgTable("enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  classId: varchar("class_id").notNull(),
  studentId: varchar("student_id").notNull(),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  attended: boolean("attended").default(false),
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrolledAt: true,
  attended: true,
});
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollments.$inferSelect;

export const recordings = pgTable("recordings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  classId: varchar("class_id").notNull(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  duration: integer("duration"),
  thumbnailUrl: text("thumbnail_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRecordingSchema = createInsertSchema(recordings).omit({
  id: true,
  createdAt: true,
});
export type InsertRecording = z.infer<typeof insertRecordingSchema>;
export type Recording = typeof recordings.$inferSelect;

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  classId: varchar("class_id").notNull(),
  userId: varchar("user_id").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
