# IUTH Live Class Platform

## Overview
A custom live streaming platform for Igbinedion University Teaching Hospital (IUTH) for hosting online classes. The platform includes video conferencing UI, class scheduling, student management, user authentication with roles (Admin/Lecturer/Student), real-time chat, class recordings, and IUTH-branded design.

## Current State
- **Phase**: MVP Development Complete
- **Status**: Core features implemented, ready for testing

## Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth (Google, GitHub, email)
- **Routing**: Wouter
- **State Management**: TanStack Query

## Project Architecture

### Frontend (`client/src/`)
- `pages/` - Page components
  - `landing.tsx` - Public landing page
  - `dashboard.tsx` - User dashboard with role-based views
  - `schedule.tsx` - Class scheduling (lecturers only)
  - `recordings.tsx` - Recording library
  - `classroom.tsx` - Live class room with controls and chat
- `components/` - Reusable UI components
  - `app-sidebar.tsx` - Navigation sidebar
  - `theme-toggle.tsx` - Dark/light mode toggle
  - `ui/` - Shadcn components

### Backend (`server/`)
- `routes.ts` - API endpoints
- `storage.ts` - Database operations
- `db.ts` - Database connection
- `replit_integrations/auth/` - Authentication integration

### Shared (`shared/`)
- `schema.ts` - Database schema (classes, enrollments, recordings, chat)
- `models/auth.ts` - User model with roles

## Database Schema

### Users (from auth)
- id, email, firstName, lastName, profileImageUrl, role (admin/lecturer/student)

### Classes
- id, title, description, lecturerId, scheduledAt, duration, status, roomCode

### Enrollments
- id, classId, studentId, enrolledAt, attended

### Recordings
- id, classId, title, url, duration, thumbnailUrl

### Chat Messages
- id, classId, userId, message, createdAt

## API Routes
- `GET /api/classes` - Get upcoming classes
- `GET /api/classes/:id` - Get single class
- `POST /api/classes` - Create class (auth required)
- `PATCH /api/classes/:id/status` - Update class status
- `GET /api/lecturer/classes` - Get lecturer's classes
- `POST /api/enrollments` - Enroll in class
- `GET /api/enrollments/student` - Get student enrollments
- `GET /api/recordings` - Get all recordings
- `GET/POST /api/chat/:classId` - Class chat messages
- `PATCH /api/users/:id/role` - Update user role (admin)

## User Roles
- **Admin**: Full access, user management
- **Lecturer**: Create/manage classes, view students
- **Student**: Join classes, view recordings

## Running the Project
- Dev: `npm run dev` (starts Express + Vite)
- DB Push: `npm run db:push`

## Recent Changes
- December 17, 2025: Initial MVP implementation
  - Landing page with IUTH branding
  - Dashboard with role-based views
  - Class scheduling for lecturers
  - Classroom with chat sidebar
  - Recordings library
  - Sidebar navigation with theme toggle
