# GOAT Media Backend Manual

This document provides a comprehensive overview of the backend system for the GOAT Media dual-dashboard SaaS application. It covers the database schema, setup instructions, API endpoints, and more.

## 1. Database Schema Overview

The database is built on PostgreSQL and managed via the Prisma ORM. The schema is defined in `prisma/schema.prisma`.

### Core Models:

- **User**: Stores user profile information (name, email, role). Note: Not used for authentication in the current dummy system.
- **Client**: Represents the companies or individuals who hire GOAT Media.
- **Project**: A container for grouping related tasks (e.g., a marketing campaign).
- **Task**: Represents individual work items assigned to users, linked to projects.
- **Shoot**: A scheduled event for content creation, linked to clients and team members.
- **Lead**: A potential new client or project, tracked through a sales pipeline.
- **Invoice**: Financial documents for billing clients.
- **Revenue & Expense**: Records for tracking profit and loss.
- **Script**: Stores creative scripts, with a version history.
- **EditingTask**: Tracks post-production work, including feedback comments.
- **Notification**: A system for user alerts.
- **Faq**: Stores questions and answers for the Help Centre.

### Key Relationships:

- `User` has many `Tasks`, `ShootAssignments`, `Leads`, and `Notifications`.
- `Client` has many `Shoots` and `Invoices`.
- `Project` has many `Tasks`.
- `Shoot` has many `ShootAssignments` (linking `Users` to `Shoots`).
- `Script` has many `ScriptVersions`.
- `EditingTask` has many `Comments`.
- `Invoice` is linked to one `Client` and can have one `Revenue` entry.

## 2. Supabase Setup & Migrations

The backend is configured to work with a Supabase PostgreSQL database.

### Steps to Set Up:

1.  **Get Connection String**: In your Supabase project, navigate to **Project Settings > Database** and copy the **Connection String URI**. It starts with `postgresql://`.

2.  **Set Environment Variable**: Create a `.env` file in the root of the project (this is git-ignored) and add your connection string:
    ```
    DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST].supabase.co:5432/postgres"
    ```

3.  **Run Migrations**: The database schema is managed by Prisma Migrate. To apply all migrations and create the schema in your Supabase database, run the following command:
    ```bash
    npx prisma migrate dev
    ```
    This command will read the migration files from the `prisma/migrations` directory and apply them to your database, bringing it in sync with the `prisma/schema.prisma` file.

## 3. API Endpoints

All endpoints are available under the `/api/` path.

---

### Authentication

- **POST `/api/login`**: The dummy login endpoint.
  - **Body**: `{ "email": "alex.employee@goat.media", "password": "password123" }`
  - **Returns**: A dummy token and user profile object.

---

### Tasks

- **GET `/api/tasks`**: Fetches all tasks.
- **POST `/api/tasks`**: Creates a new task.
  - **Body**: `{ "title": "New Task", "assigneeId": "...", "projectId": "..." }`
- **GET `/api/tasks/:id`**: Fetches a single task by ID.
- **PUT `/api/tasks/:id`**: Updates a task's details.
- **DELETE `/api/tasks/:id`**: Deletes a task.
- **PUT `/api/tasks/:id/status`**: Updates a task's status.
  - **Body**: `{ "status": "COMPLETED" }`
- **PUT `/api/tasks/:id/priority`**: Updates a task's priority.
  - **Body**: `{ "priority": "HIGH" }`

---

### Scripts

- **GET `/api/scripts`**: Fetches all scripts with their versions.
- **POST `/api/scripts`**: Creates a new script with an initial version.
  - **Body**: `{ "title": "My New Script", "initialContent": "Once upon a time..." }`
- **GET `/api/scripts/:id`**: Fetches a single script by ID.
- **PUT `/api/scripts/:id`**: Updates a script's title.
- **DELETE `/api/scripts/:id`**: Deletes a script and its versions.
- **POST `/api/scripts/:id/versions`**: Creates a new version for a script.
  - **Body**: `{ "content": "A new revision of the content." }`

---

### Shoots

- **GET `/api/shoots`**: Fetches all shoots.
- **POST `/api/shoots`**: Creates a new shoot.
  - **Body**: `{ "title": "Client Photoshoot", "startTime": "...", "endTime": "...", "clientId": "..." }`
- **GET `/api/shoots/:id`**: Fetches a single shoot by ID.
- **PUT `/api/shoots/:id`**: Updates a shoot's details.
- **DELETE `/api/shoots/:id`**: Deletes a shoot.
- **POST `/api/shoots/:id/assign-team`**: Assigns a user to a shoot.
  - **Body**: `{ "userId": "...", "role": "Director" }`
- **PUT `/api/shoots/:id/approval`**: Allows an executive to approve or reject a shoot.
  - **Body**: `{ "status": "APPROVED" }`

---

### Content Studio

- **POST `/api/content-studio/generate-script`**: Mock AI script generation.
  - **Body**: `{ "topic": "New Marketing Angles" }`

---

### Leads

- **GET `/api/leads`**: Fetches all leads.
- **POST `/api/leads`**: Creates a new lead.
  - **Body**: `{ "name": "John Smith", "email": "john@example.com" }`
- **GET `/api/leads/:id`**: Fetches a single lead.
- **PUT `/api/leads/:id`**: Updates a lead's details.
- **DELETE `/api/leads/:id`**: Deletes a lead.
- **PUT `/api/leads/:id/status`**: Updates a lead's status.
  - **Body**: `{ "status": "QUALIFIED" }`
- **POST `/api/leads/:id/assign`**: Assigns a lead to a user.
  - **Body**: `{ "userId": "..." }`

---

### Revenue & Invoices

- **GET `/api/invoices`**: Fetches all invoices.
- **POST `/api/invoices`**: Creates a new invoice.
- **GET `/api/invoices/:id`**: Fetches a single invoice.
- **PUT `/api/invoices/:id`**: Updates an invoice. (e.g., to mark as `PAID`).
- **DELETE `/api/invoices/:id`**: Deletes an invoice.
- **GET `/api/revenue/overview`**: Gets a summary of key financial metrics.
- **GET `/api/revenue/by-client`**: Gets a breakdown of paid revenue per client.
- **GET `/api/revenue/trends`**: Gets monthly revenue vs. expense data for charting.

---

### Editing Workflow

- **GET `/api/editing-tasks`**: Fetches all editing tasks.
- **POST `/api/editing-tasks`**: Creates a new editing task.
- **GET `/api/editing-tasks/:id`**: Fetches a single editing task.
- **PUT `/api/editing-tasks/:id`**: Updates an editing task.
- **DELETE `/api/editing-tasks/:id`**: Deletes an editing task.
- **GET `/api/editing-tasks/:id/comments`**: Fetches all comments for a task.
- **POST `/api/editing-tasks/:id/comments`**: Adds a new comment to a task.
  - **Body**: `{ "content": "Great work!", "timestamp": 12.5 }`
- **DELETE `/api/editing-tasks/:taskId/comments/:commentId`**: Deletes a comment.

---

### Users & Team Management

- **GET `/api/users`**: Fetches a list of all users.
- **GET `/api/users/:id`**: Fetches a single user's profile.
- **PUT `/api/users/:id`**: Updates a user's profile.

---

### Notifications

- **GET `/api/notifications?userId=...`**: Fetches notifications for a given user.
- **POST `/api/notifications`**: Creates a new notification.
- **PUT `/api/notifications/:id/read`**: Marks a notification as read or unread.
  - **Body**: `{ "read": true }`

---

### Help Centre

- **GET `/api/faq`**: Fetches all FAQ entries.

## 4. Insights Queries (Examples)

The insights endpoints use Prisma's aggregation and grouping features.

### Revenue Overview
This endpoint uses `prisma.revenue.aggregate({ _sum: { amount: true } })` and similar queries on expenses and invoices to calculate the main dashboard numbers.

### Revenue by Client
This endpoint uses `prisma.invoice.groupBy()` to sum up all paid invoice amounts for each `clientId`.
```typescript
// Example from /api/revenue/by-client/route.ts
const revenueByClient = await prisma.invoice.groupBy({
  by: ['clientId'],
  _sum: { amount: true },
  where: { status: 'PAID' },
});
```

### Team Performance Insights
- **GET `/api/performance/workload`**: Fetches the number of open tasks for each user to gauge current workload.
- **GET `/api/performance/productivity`**: Calculates a weighted productivity score for each user based on tasks completed in the last 30 days.

## 5. Seeding the Database

To populate your database with realistic demo data, you can use the seed script.

### How to Run:

1.  Ensure your `.env` file is configured with your `DATABASE_URL`.
2.  Run the following command:
    ```bash
    npm run db:seed
    ```
    This will execute the `prisma/seed.ts` script, which cleans the database and then creates a fresh set of demo data for all models.

## 6. Future Steps: Authentication & RBAC

The current system uses a dummy login and all API endpoints are public. Here is a high-level guide to implementing proper authentication and authorization.

### Step 1: Integrate a Real Authentication Provider
- **Recommended**: Use Supabase Auth. It integrates well with the Next.js ecosystem.
- When a user signs up/logs in with Supabase Auth, you will get a JWT (JSON Web Token).

### Step 2: Secure API Endpoints
- Create a middleware file (`middleware.ts`) in your project root.
- In the middleware, read the JWT from the request headers (`Authorization: Bearer <token>`).
- Use Supabase's library to verify the token. If it's invalid or missing, redirect the user or return a 401 Unauthorized error.

### Step 3: Implement Role-Based Access Control (RBAC)
- After verifying the JWT, you will have the user's ID.
- In each API route that needs protection, use the user ID to fetch the user's `role` from your own `User` table in the database.
- **Example Check**: For an executive-only endpoint like `/api/revenue/overview`, your code should look something like this at the beginning of the request handler:
  ```typescript
  // Psuedo-code for an API handler
  const user = await getUserFromRequest(request); // Helper to get user from token
  if (!user || user.role !== 'EXECUTIVE') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  // ... rest of the API logic
  ```
- This ensures that only users with the correct role can access sensitive data or perform privileged actions.
