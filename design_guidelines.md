# IUTH Live Class Platform - Design Guidelines

## Design Approach

**Selected Approach**: Design System (Material Design-inspired)

**Rationale**: Educational platforms require clarity, reliability, and efficiency. Material Design provides robust patterns for dashboards, data displays, and complex interactions while maintaining professional aesthetics suitable for academic/medical institutions.

**Core Principles**:
- Clarity over decoration: Information hierarchy drives design
- Consistent patterns: Repeatable UI elements across all screens
- Accessibility: High contrast text, clear CTAs, keyboard navigation
- Professional trust: Clean layouts reflecting institutional credibility

---

## Core Design Elements

### A. Typography

**Font System**: 
- Primary: Inter or Roboto (body text, UI elements)
- Secondary: Poppins or Montserrat (headings, emphasis)

**Hierarchy**:
- H1: 2.5rem/3rem, Bold - Page titles, hero headlines
- H2: 2rem/2.5rem, Semibold - Section headers, dashboard modules
- H3: 1.5rem/2rem, Semibold - Card titles, subsection headers
- H4: 1.25rem/1.5rem, Medium - List headers, form labels
- Body: 1rem, Regular - Paragraph text, descriptions
- Small: 0.875rem, Regular - Metadata, timestamps, captions
- Tiny: 0.75rem, Medium - Badges, status indicators

**Text Styles**:
- Use Medium weight for emphasis within body text
- All-caps with letter-spacing (0.05em) for labels/tags
- Line height: 1.5 for body, 1.2 for headings

---

### B. Layout System

**Spacing Scale**: Use Tailwind units of **2, 4, 6, 8, 12, 16, 20** for consistency

**Common Patterns**:
- Component padding: p-6 to p-8
- Section spacing: py-12 to py-16 (desktop), py-8 (mobile)
- Card gaps: gap-6
- Element margins: mb-4, mb-6, mb-8
- Form field spacing: space-y-4

**Grid Structure**:
- Dashboard: 12-column grid with sidebar (3 cols) + main (9 cols)
- Class cards: 3-column grid (lg), 2-column (md), 1-column (mobile)
- Calendar view: 7-column grid for weekdays
- Max-width containers: max-w-7xl centered with mx-auto

**Responsive Breakpoints**:
- Mobile-first approach
- Stack to single column below md: breakpoint
- Reduce padding/spacing on mobile (p-4 instead of p-8)

---

### C. Component Library

#### Navigation Components

**Top Navigation Bar**:
- Fixed position with subtle shadow
- Logo (IUTH branding) left-aligned
- Horizontal nav links center-aligned
- User profile dropdown right-aligned
- Height: h-16 to h-20
- Sticky on scroll with slight opacity change

**Sidebar Navigation** (Dashboard):
- Fixed left sidebar, w-64 width
- Icon + label for each menu item (p-3 each)
- Active state: slight background emphasis with indicator bar
- Collapsible on mobile (hamburger menu)
- Section dividers with small headers

#### Dashboard Components

**Stat Cards**:
- Grid of 3-4 cards showing key metrics
- Each card: p-6 padding, rounded corners
- Large number (text-3xl) with label below (text-sm)
- Icon in top-right corner (decorative)
- Subtle shadow for elevation

**Class Schedule Card**:
- Header with date/time (text-lg, bold)
- Subject/topic (text-base)
- Lecturer name with small avatar
- Join button (prominent, right-aligned)
- Attendance count or status badge
- List view with dividers between items

**Calendar Widget**:
- Month view with 7-column grid
- Day cells: aspect-square, p-2
- Current day highlighted distinctly
- Scheduled classes shown as colored dots/badges
- Click to see day's schedule details

#### Live Class Room Components

**Video Display**:
- Main video takes majority screen space (16:9 aspect ratio)
- Grid view for multiple participants (max 4x4)
- Active speaker highlighted with border emphasis
- Full-screen toggle in top-right
- Control bar overlay at bottom (auto-hide)

**Control Bar**:
- Fixed bottom position with backdrop blur
- Icon buttons for: Mic, Camera, Screen Share, Chat, Leave
- Centered button group with equal spacing (gap-4)
- Mic/Camera show active state visually
- Red Leave button isolated on right

**Chat Sidebar** (Live Class):
- Right sidebar, w-80 width
- Message list with auto-scroll to bottom
- Each message: small avatar + name + timestamp + text
- Input field fixed at bottom with send button
- Unread badge when collapsed

**Student Roster Panel**:
- Toggleable right panel
- List of enrolled students with avatars
- Attendance indicator (green dot = present)
- Search/filter bar at top
- Scrollable list with hover states

#### Form Components

**Input Fields**:
- Consistent height (h-12)
- Rounded borders (rounded-md)
- Label above field (text-sm, mb-2)
- Helper text below in muted style
- Error states with small alert icon

**Dropdowns/Selects**:
- Match input field height
- Chevron icon right-aligned
- Menu opens below with max-height scroll
- Hover states on options

**File Upload**:
- Dashed border dropzone
- Upload icon centered
- Drag-and-drop area with "or browse" link
- File list below with remove icons

**Buttons**:
- Primary: Bold, prominent (px-6, py-3)
- Secondary: Outlined style
- Text buttons: No background, underline on hover
- Icon buttons: Circular or square, p-2
- Consistent border-radius (rounded-md)
- Disabled state with reduced opacity

#### Cards & Containers

**Content Cards**:
- Rounded corners (rounded-lg)
- Subtle shadow for depth
- Padding: p-6 to p-8
- Header with title and optional action button
- Divider line below header

**Modal Dialogs**:
- Overlay with backdrop blur
- Card centered on screen, max-w-2xl
- Close icon in top-right
- Footer with action buttons right-aligned
- Padding: p-8

---

### D. Animations

**Use Sparingly**:
- Smooth transitions on hover (transition-all duration-200)
- Fade-in for modal overlays (opacity transition)
- Slide-in for sidebar/chat panels
- Subtle scale on button hover (scale-105)
- No distracting animations during live classes

**Focus States**:
- Clear outline for keyboard navigation
- No removal of default focus indicators

---

## Page-Specific Layouts

### Landing/Login Page

**Hero Section** (100vh):
- Large hero image: Medical/university campus backdrop with overlay
- Centered content: IUTH logo, headline, tagline
- Two-column form below hero: Login (left) | Sign Up (right)
- Each form in contained card with p-8 padding

**Features Section**:
- Three-column grid showcasing platform features
- Icon + heading + description in each card
- py-20 section padding

**Footer**:
- Single row with university contact info
- Links to help/support
- Copyright text

---

### Dashboard (Student View)

**Layout**:
- Sidebar (left, w-64): Navigation menu
- Main content area (right, flex-1): 
  - Top: Welcome header with student name
  - Stats row: 3 metric cards (Upcoming Classes, Completed, Attendance Rate)
  - Two-column grid: 
    - Left (2/3): Upcoming classes list
    - Right (1/3): Calendar widget
  - Bottom section: Recent recordings grid

---

### Dashboard (Lecturer View)

**Layout**:
- Similar sidebar structure
- Main area:
  - Quick action buttons (Create Class, Upload Material)
  - Stats cards: Total Classes, Active Students, Avg Attendance
  - Class management table with columns: Class Name, Date/Time, Students, Status, Actions
  - Pagination at bottom

---

### Live Class Room

**Layout** (Full-screen experience):
- Main video area (center, majority space)
- Top bar: Class title, participant count, timer
- Bottom control bar: Media controls (auto-hide after 3s idle)
- Right sidebar (toggleable): Chat or Student List tabs
- Exit confirmation modal when leaving

**Grid View** (Multiple Participants):
- Maximum 4x4 grid of equal-sized video tiles
- Each tile: Name label overlay at bottom
- Active speaker gets subtle border highlight

---

### Class Scheduling Page

**Layout**:
- Header: "Schedule New Class" with back button
- Multi-step form:
  - Step 1: Basic details (Title, Description, Date/Time)
  - Step 2: Student enrollment (searchable list with checkboxes)
  - Step 3: Materials upload (drag-drop file area)
  - Progress indicator at top
- Action buttons at bottom: Back | Next/Submit

---

### Recordings Library

**Layout**:
- Filter bar at top: Search, Date range, Subject dropdown
- Grid layout: 3 columns (lg), 2 (md), 1 (mobile)
- Each recording card:
  - Video thumbnail with play icon overlay
  - Title and date below
  - Duration badge in top-right
  - Lecturer name with small avatar
- Load more button at bottom

---

### Student/User Profile Page

**Layout**:
- Header section: Avatar (large), Name, Email, Role
- Tabbed interface: Profile Info | Classes | Performance
- Each tab content in cards with appropriate forms/data displays
- Edit button in top-right

---

## Images

**Hero Image** (Landing Page):
- Large, professional photograph showing:
  - Modern classroom or lecture hall
  - Medical students in discussion or lab setting
  - University campus architecture
  - Subtle overlay gradient for text readability
- Placement: Full-width background, 100vh height
- Blur buttons placed on hero to integrate with background

**Lecturer Avatars**:
- Circular profile images (w-10 h-10 for small, w-16 h-16 for large)
- Fallback: Initials on solid background
- Used in: Class cards, chat messages, rosters

**Iconography**:
- Outline-style icons (Heroicons or similar)
- Consistent stroke width across all icons
- Size: w-5 h-5 for inline, w-8 h-8 for feature cards

**Empty States**:
- Friendly illustrations for:
  - No upcoming classes
  - No recordings available
  - Empty chat
- Center-aligned with supporting text

**Brand Integration**:
- IUTH logo: Top-left in navigation (h-8 to h-10)
- University seal/emblem: Subtle watermark in footer or login card corner

---

## Accessibility & Usability

- All interactive elements keyboard-accessible
- ARIA labels on icon-only buttons
- Adequate contrast ratios for all text
- Video captions toggle in live class controls
- Screen reader friendly navigation landmarks
- Focus management in modals and dynamic content

---

**Deliverable**: A clean, professional, and functional live class platform that reflects the credibility of IUTH while providing an intuitive experience for students and lecturers. Every component serves a clear purpose with no unnecessary decoration.