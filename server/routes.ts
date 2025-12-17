import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClassSchema, insertEnrollmentSchema, insertChatMessageSchema } from "@shared/schema";
import { isAuthenticated } from "./replit_integrations/auth/replitAuth";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/classes", async (req, res) => {
    try {
      const classes = await storage.getUpcomingClasses();
      res.json(classes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch classes" });
    }
  });

  app.get("/api/classes/:id", async (req, res) => {
    try {
      const classItem = await storage.getClass(req.params.id);
      if (!classItem) {
        return res.status(404).json({ message: "Class not found" });
      }
      res.json(classItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch class" });
    }
  });

  app.get("/api/classes/room/:roomCode", async (req, res) => {
    try {
      const classItem = await storage.getClassByRoomCode(req.params.roomCode);
      if (!classItem) {
        return res.status(404).json({ message: "Class not found" });
      }
      res.json(classItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch class" });
    }
  });

  app.post("/api/classes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const classData = insertClassSchema.parse({
        ...req.body,
        lecturerId: userId,
      });
      const newClass = await storage.createClass(classData);
      res.status(201).json(newClass);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid class data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create class" });
    }
  });

  app.patch("/api/classes/:id/status", isAuthenticated, async (req, res) => {
    try {
      const { status } = req.body;
      const updated = await storage.updateClassStatus(req.params.id, status);
      if (!updated) {
        return res.status(404).json({ message: "Class not found" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update class status" });
    }
  });

  app.get("/api/lecturer/classes", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const classes = await storage.getClassesByLecturer(userId);
      res.json(classes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lecturer classes" });
    }
  });

  app.post("/api/enrollments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const enrollment = insertEnrollmentSchema.parse({
        ...req.body,
        studentId: userId,
      });
      const newEnrollment = await storage.createEnrollment(enrollment);
      res.status(201).json(newEnrollment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid enrollment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create enrollment" });
    }
  });

  app.get("/api/enrollments/student", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const enrollments = await storage.getEnrollmentsByStudent(userId);
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  app.get("/api/enrollments/class/:classId", isAuthenticated, async (req, res) => {
    try {
      const enrollments = await storage.getEnrollmentsByClass(req.params.classId);
      res.json(enrollments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch enrollments" });
    }
  });

  app.post("/api/enrollments/attendance", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { classId } = req.body;
      const enrollment = await storage.markAttendance(classId, userId);
      res.json(enrollment);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark attendance" });
    }
  });

  app.get("/api/recordings", async (req, res) => {
    try {
      const recordings = await storage.getAllRecordings();
      res.json(recordings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recordings" });
    }
  });

  app.get("/api/recordings/class/:classId", async (req, res) => {
    try {
      const recordings = await storage.getRecordingsByClass(req.params.classId);
      res.json(recordings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recordings" });
    }
  });

  app.get("/api/chat/:classId", isAuthenticated, async (req, res) => {
    try {
      const messages = await storage.getChatMessagesByClass(req.params.classId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post("/api/chat", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const messageData = insertChatMessageSchema.parse({
        ...req.body,
        userId,
      });
      const message = await storage.createChatMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.get("/api/users", isAuthenticated, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.patch("/api/users/:id/role", isAuthenticated, async (req, res) => {
    try {
      const { role } = req.body;
      const user = await storage.updateUserRole(req.params.id, role);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  return httpServer;
}
