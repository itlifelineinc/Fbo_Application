# Nexu Backend Specification
**Version:** 1.0
**Stack:** Go (Golang), Fiber (Web Framework), PostgreSQL, Prisma ORM.

## 1. Architecture & Tech Stack

*   **Language:** Go (Latest)
*   **Web Framework:** [Fiber](https://gofiber.io/) (Chosen for high performance and Express-like simplicity).
*   **Database:** PostgreSQL 15+
*   **ORM:** [Prisma Client Go](https://github.com/steebchen/prisma-client-go)
*   **Authentication:** JWT (JSON Web Tokens) with Middleware.
*   **Storage:** Local disk (for dev) or S3-compatible (for prod) for image uploads.

---

## 2. Database Schema (Prisma)

Paste this directly into `schema.prisma`.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator db {
  provider = "go run github.com/steebchen/prisma-client-go"
}

enum Role {
  STUDENT
  SPONSOR
  ADMIN
  SUPER_ADMIN
}

enum CourseStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

// --- USER & HIERARCHY ---

model User {
  id             String    @id @default(uuid())
  handle         String    @unique // e.g. @alice_success
  email          String    @unique
  passwordHash   String
  name           String
  role           Role      @default(STUDENT)
  phoneNumber    String?
  avatarUrl      String?
  country        String?
  foreverId      String?   // Official FBO ID
  
  // Hierarchy: Self-referencing relationship
  sponsorId      String?
  sponsor        User?     @relation("Sponsorship", fields: [sponsorId], references: [id])
  downline       User[]    @relation("Sponsorship")

  // Data
  createdAt      DateTime  @default(now())
  rankProgress   RankProgress?
  
  // Relationships
  salesHistory   SaleRecord[]
  enrollments    Enrollment[]
  assignments    AssignmentSubmission[]
  createdCourses Course[]  @relation("Author")
  broadcasts     Broadcast[]
  salesPages     SalesPage[]
}

// --- RANK ENGINE ---

model RankProgress {
  id             String   @id @default(uuid())
  userId         String   @unique
  user           User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  currentRankId  String   @default("NOVUS") // Enum in code, String in DB for flexibility
  currentCycleCC Float    @default(0.0)     // CC accumulated in current 2-month cycle
  lifetimeCC     Float    @default(0.0)     // Total career CC
  
  // History stored as JSON: [{ rankId: "AS_SUP", date: "...", totalCC: 25 }]
  history        Json     @default("[]") 
}

// --- LMS (COURSES) ---

model Course {
  id             String       @id @default(uuid())
  title          String
  description    String
  thumbnailUrl   String?
  status         CourseStatus @default(DRAFT)
  
  authorId       String
  author         User         @relation("Author", fields: [authorId], references: [id])
  
  modules        Module[]
  enrollments    Enrollment[]
  
  // JSON for flexible settings (gamification, points, price)
  settings       Json         @default("{}") 
  
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

model Module {
  id        String    @id @default(uuid())
  courseId  String
  course    Course    @relation(fields: [courseId], references: [id], onDelete: Cascade)
  title     String
  order     Int
  chapters  Chapter[]
}

model Chapter {
  id              String   @id @default(uuid())
  moduleId        String
  module          Module   @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  title           String
  content         String   @db.Text // HTML or Markdown
  type            String   @default("TEXT") // TEXT, VIDEO, QUIZ
  videoUrl        String?
  durationMinutes Int      @default(10)
  
  // JSON for quiz questions: [{ question: "...", options: [], answer: 0 }]
  quizData        Json?    
}

model Enrollment {
  id                String   @id @default(uuid())
  userId            String
  user              User     @relation(fields: [userId], references: [id])
  courseId          String
  course            Course   @relation(fields: [courseId], references: [id])
  
  progressPercent   Int      @default(0)
  completedChapters String[] // Array of Chapter IDs
  
  createdAt         DateTime @default(now())

  @@unique([userId, courseId])
}

// --- SALES & ANALYTICS ---

model SaleRecord {
  id            String   @id @default(uuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  
  amount        Float
  ccEarned      Float
  transactionId String?
  receiptUrl    String?
  status        String   @default("APPROVED") // PENDING, APPROVED
  type          String   // RETAIL, WHOLESALE
  
  date          DateTime @default(now())
}

// --- SALES PAGE BUILDER ---

model SalesPage {
  id             String   @id @default(uuid())
  userId         String
  user           User     @relation(fields: [userId], references: [id])
  
  title          String
  slug           String   @unique
  isPublished    Boolean  @default(false)
  
  // The entire page configuration (Products, Colors, Copy) is stored here
  // This allows the frontend "pageDraft" object to be saved directly.
  content        Json     
  
  views          Int      @default(0)
  leads          Int      @default(0)
  
  updatedAt      DateTime @updatedAt
}

// --- MENTORSHIP ---

model Broadcast {
  id          String   @id @default(uuid())
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  
  title       String
  content     String
  isImportant Boolean  @default(false)
  
  // JSON array of recipient User IDs
  recipients  Json     
  
  createdAt   DateTime @default(now())
}

model AssignmentSubmission {
  id           String   @id @default(uuid())
  userId       String
  user         User     @relation(fields: [userId], references: [id])
  
  assignmentId String // ID from the frontend Assignment definition
  answers      Json   // JSON array of answers
  
  status       String @default("SUBMITTED")
  submittedAt  DateTime @default(now())
}
```

---

## 3. API Endpoints Specification

### A. Authentication
*   `POST /api/auth/register`
    *   **Input**: `{ name, email, password, sponsorHandle (optional) }`
    *   **Logic**: Hash password. Look up `sponsorHandle` to get UUID. Create User + RankProgress (init 0 CC).
*   `POST /api/auth/login`
    *   **Input**: `{ handle, password }`
    *   **Output**: `{ token, user: { ...profile } }`
*   `GET /api/auth/me` (Protected)
    *   Returns full user profile + rank progress.

### B. The Rank Engine (Business Logic)
This is not just an endpoint, but a **Service** called `RankService`.

*   **Logic**: `UpdateCC(userId, amount)`
    1.  Fetch `RankProgress` for user.
    2.  Update `currentCycleCC` += amount.
    3.  Update `lifetimeCC` += amount.
    4.  **Check Promotion**:
        *   Get current rank rules (e.g., Target: 2.0 CC).
        *   If `currentCycleCC` >= `target`, promote user.
        *   Update `currentRankId` in DB.
        *   Reset `currentCycleCC` to 0 (if logic requires cycle reset on rank up).
        *   Add entry to `history` JSON.
    5.  Save to DB.

### C. Sales & Receipts
*   `POST /api/sales` (Protected)
    *   **Input**: `{ amount, type, transactionId, receiptImage (Multipart) }`
    *   **Logic**:
        1.  Upload image (if any) to local/S3.
        2.  Calculate CC (Amount / Divisor).
        3.  Create `SaleRecord`.
        4.  **Call `RankService.UpdateCC(userId, ccCalculated)`**.
    *   **Gemini Integration**:
        *   Create endpoint `POST /api/sales/analyze`.
        *   Server accepts image -> Sends to Google Gemini API (Server-side) -> Returns JSON `{ amount, id }` to frontend.

### D. Courses (LMS)
*   `GET /api/courses`
    *   Returns list. Filter by `settings->teamOnly`.
*   `GET /api/courses/:id`
    *   Returns full course with modules/chapters.
*   `POST /api/courses/:id/enroll`
    *   Creates `Enrollment` record.
*   `PUT /api/courses/:id/progress`
    *   **Input**: `{ chapterId }`
    *   **Logic**: Add chapterId to `completedChapters` array. Recalculate %.

### E. Sales Page Builder
*   `POST /api/pages`
    *   **Input**: `{ title, slug, content: JSON }`
    *   **Logic**: Save the entire frontend `pageDraft` state into the `content` JSON column.
*   `GET /api/pages/:slug` (Public)
    *   **Auth**: **None** (Public endpoint).
    *   **Logic**: Fetch page by slug. Increment `views` counter atomically.

### F. Mentorship (Downline)
*   `GET /api/team/downline`
    *   **Logic**: Fetch all Users where `sponsorId == currentUser.id`.
    *   Include `RankProgress` relation to show their stats.
*   `POST /api/broadcasts`
    *   **Input**: `{ title, content, recipients: [userIds] }`
    *   **Logic**: Create Broadcast record. (Real-time notifications would use WebSockets in Go/Fiber later).

---

## 4. Instructions for the AI

Copy and paste the prompt below into your AI editor to start building:

> "I need to build the backend for the Nexu application using **Go (Golang)** and **Fiber**.
>
> 1.  **Initialize the Project**: Set up a new Go module. Install `gofiber/fiber/v2`, `joho/godotenv`, and the Prisma Client for Go.
> 2.  **Database**: I will provide the `schema.prisma` file below. Please generate the Go client code.
> 3.  **Structure**: Use a clean architecture:
>     *   `/models` (Prisma gen)
>     *   `/handlers` (HTTP controllers)
>     *   `/routes` (Fiber route definitions)
>     *   `/services` (Business logic like Rank Calculation)
>     *   `/middleware` (JWT Auth)
> 4.  **Implementation**:
>     *   Start with **Auth** (Register/Login) and the **RankService** (calculating CC).
>     *   Implement the **Sales Page Builder** endpoints treating the page content as a JSON blob.
>     *   Ensure CORS is enabled so my React frontend can talk to it.
>
> Here is the full **Database Schema** and **API Specification**..."
> [PASTE THE SCHEMA AND SPEC FROM SECTIONS 2 & 3 ABOVE]
