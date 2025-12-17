import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";
import { 
  classes, 
  enrollments, 
  recordings, 
  chatMessages,
  type Class, 
  type InsertClass, 
  type Enrollment, 
  type InsertEnrollment,
  type Recording,
  type InsertRecording,
  type ChatMessage,
  type InsertChatMessage
} from "@shared/schema";
import { users, type User, type UpsertUser } from "@shared/models/auth";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserRole(id: string, role: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  
  createClass(classData: InsertClass): Promise<Class>;
  getClass(id: string): Promise<Class | undefined>;
  getClassByRoomCode(roomCode: string): Promise<Class | undefined>;
  getClassesByLecturer(lecturerId: string): Promise<Class[]>;
  getUpcomingClasses(): Promise<Class[]>;
  updateClassStatus(id: string, status: string): Promise<Class | undefined>;
  
  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  getEnrollmentsByClass(classId: string): Promise<Enrollment[]>;
  getEnrollmentsByStudent(studentId: string): Promise<Enrollment[]>;
  markAttendance(classId: string, studentId: string): Promise<Enrollment | undefined>;
  
  createRecording(recording: InsertRecording): Promise<Recording>;
  getRecordingsByClass(classId: string): Promise<Recording[]>;
  getAllRecordings(): Promise<Recording[]>;
  
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessagesByClass(classId: string): Promise<ChatMessage[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserRole(id: string, role: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users).orderBy(desc(users.createdAt));
  }

  async createClass(classData: InsertClass): Promise<Class> {
    const roomCode = randomUUID().slice(0, 8).toUpperCase();
    const [newClass] = await db
      .insert(classes)
      .values({ ...classData, roomCode })
      .returning();
    return newClass;
  }

  async getClass(id: string): Promise<Class | undefined> {
    const [classItem] = await db.select().from(classes).where(eq(classes.id, id));
    return classItem;
  }

  async getClassByRoomCode(roomCode: string): Promise<Class | undefined> {
    const [classItem] = await db.select().from(classes).where(eq(classes.roomCode, roomCode));
    return classItem;
  }

  async getClassesByLecturer(lecturerId: string): Promise<Class[]> {
    return db.select().from(classes).where(eq(classes.lecturerId, lecturerId)).orderBy(desc(classes.scheduledAt));
  }

  async getUpcomingClasses(): Promise<Class[]> {
    return db.select().from(classes).where(eq(classes.status, "scheduled")).orderBy(classes.scheduledAt);
  }

  async updateClassStatus(id: string, status: string): Promise<Class | undefined> {
    const [updated] = await db
      .update(classes)
      .set({ status })
      .where(eq(classes.id, id))
      .returning();
    return updated;
  }

  async createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment> {
    const [newEnrollment] = await db.insert(enrollments).values(enrollment).returning();
    return newEnrollment;
  }

  async getEnrollmentsByClass(classId: string): Promise<Enrollment[]> {
    return db.select().from(enrollments).where(eq(enrollments.classId, classId));
  }

  async getEnrollmentsByStudent(studentId: string): Promise<Enrollment[]> {
    return db.select().from(enrollments).where(eq(enrollments.studentId, studentId));
  }

  async markAttendance(classId: string, studentId: string): Promise<Enrollment | undefined> {
    const [updated] = await db
      .update(enrollments)
      .set({ attended: true })
      .where(and(eq(enrollments.classId, classId), eq(enrollments.studentId, studentId)))
      .returning();
    return updated;
  }

  async createRecording(recording: InsertRecording): Promise<Recording> {
    const [newRecording] = await db.insert(recordings).values(recording).returning();
    return newRecording;
  }

  async getRecordingsByClass(classId: string): Promise<Recording[]> {
    return db.select().from(recordings).where(eq(recordings.classId, classId));
  }

  async getAllRecordings(): Promise<Recording[]> {
    return db.select().from(recordings).orderBy(desc(recordings.createdAt));
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }

  async getChatMessagesByClass(classId: string): Promise<ChatMessage[]> {
    return db.select().from(chatMessages).where(eq(chatMessages.classId, classId)).orderBy(chatMessages.createdAt);
  }
}

export const storage = new DatabaseStorage();
