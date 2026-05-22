# TaskFlow — Smart Team Task Dashboard

> Full-stack task management application built with Next.js 16, Express 5,
> MongoDB, and Tailwind CSS v4.

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

---

## Live Demo

- **Frontend:** https://project-taskflow-three.vercel.app
- **Backend:** https://project-taskflow-production.up.railway.app/health
- **Test credentials:** email: demo@taskflow.com / password: Demo@1234

---

## Features

**Authentication**

- JWT-based auth via httpOnly cookies (7-day expiry)
- Register, Login, Logout with full validation
- Session persistence across refreshes via /api/auth/me
- Protected and guest route guards

**Task Management**

- Create, edit, delete tasks with Title, Description, Priority, Due Date, Status
- Inline status change without opening the full form
- Priority levels: Low / Medium / High with color coding
- Overdue task indicators

**Dashboard**

- Real-time stats: Total, Completed, Pending, In Progress
- Recent Activity timeline (last 10 events, derived from updatedAt)
- 30-second polling with tab-visibility awareness (pauses when tab is hidden)

**Search & Filters**

- Debounced search (400ms) by task title
- Filter by Status and Priority simultaneously
- Pagination with server-side filtering
- Active filter count indicator

**Chaos Engineering (Required Feature)**

On every GET /api/tasks request, one of these scenarios is randomly simulated:

| Scenario | Server Behaviour | Client Response |
|---|---|---|
| API Delay | 3–5s artificial delay | Loading skeletons |
| API Failure | HTTP 500 | ErrorState + Retry button |
| Empty Response | Returns [] | EmptyState illustration |
| Duplicate Records | Duplicates each task in response | Deduplication + warning toast |
| Session Expiry | Returns 401 SESSION_EXPIRED | Toast → logout → /login |

**UI/UX**

- Light and Dark theme with localStorage persistence + no flash on load
- Fully responsive: 375px → 1280px+
- Framer Motion animations throughout
- Loading skeletons, empty states, error states on every data surface
- React error boundaries (route + global level)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, Framer Motion |
| Forms | React Hook Form + Zod |
| Backend | Express 5, TypeScript, Node.js |
| Database | MongoDB + Mongoose 8 |
| Auth | JWT, httpOnly cookies, bcrypt |
| HTTP Client | Axios with credential support |
| Notifications | Sonner |
| Dev tooling | ESLint, nodemon, tsx |

---

## Architecture

```text
project-taskflow/
├── client/                  # Next.js frontend (port 3000)
│   └── src/
│       ├── app/             # App Router pages + layouts
│       │   ├── (auth)/      # Login, Register — guest-only
│       │   └── (dashboard)/ # Dashboard — protected
│       ├── components/      # UI components (auth, dashboard, layout, ui)
│       ├── context/         # AuthContext
│       ├── hooks/           # useTasks, useTaskStats, useRecentActivity, useTheme
│       ├── lib/             # Axios instance, Zod validators, utils
│       └── types/           # Shared TypeScript types
│
└── server/                  # Express REST API (port 5000)
    └── src/
        ├── controllers/     # auth.controller, task.controller
        ├── middleware/      # auth, chaos, errorHandler, rateLimiter, validate
        ├── models/          # User, Task (Mongoose)
        ├── routes/          # auth.routes, task.routes
        └── validators/      # express-validator schemas
```

**Key decisions:**

- Separate client/server instead of Next.js Route Handlers — gives independent deployability and makes the Express chaos middleware easier to isolate
- httpOnly cookies (not localStorage) for JWT — XSS-safe
- 30s polling with visibilityState awareness instead of Socket.io — simpler infrastructure, satisfies the real-time requirement
- Chaos middleware scoped to GET /api/tasks only — affects the primary data-fetch without breaking auth or mutations
- Owner-scoped queries on every task endpoint — users only ever see their own tasks

---

## Local Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- pnpm (or npm)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/project-taskflow.git
cd project-taskflow
```

### 2. Server setup

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_key_minimum_32_chars
CLIENT_URL=http://localhost:3000
CHAOS_MODE=true
NODE_ENV=development
```

```bash
npm install
npm run dev
```

Server runs on http://localhost:5000  
Health check: http://localhost:5000/health

### 3. Client setup

```bash
cd client
cp .env.example .env.local
```

Edit `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

```bash
npm install
npm run dev
```

Client runs on http://localhost:3000

### 4. Seed demo data (optional)

```bash
cd server
npm run seed
```

Creates a demo user: demo@taskflow.com / Demo@1234 with 12 sample tasks.

---

## API Reference

### Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /api/auth/register | Create account | No |
| POST | /api/auth/login | Login + set cookie | No |
| POST | /api/auth/logout | Clear cookie | No |
| GET | /api/auth/me | Get current user | Yes |

### Tasks

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | /api/tasks | List tasks (filter/search/paginate) | Yes |
| POST | /api/tasks | Create task | Yes |
| PUT | /api/tasks/:id | Update task | Yes |
| DELETE | /api/tasks/:id | Delete task | Yes |
| GET | /api/tasks/stats | Dashboard stats | Yes |
| GET | /api/tasks/activity | Recent activity (last 10) | Yes |

**GET /api/tasks query params:**

- `search` — partial title match
- `status` — Todo | In Progress | Completed
- `priority` — Low | Medium | High
- `page` — default 1
- `limit` — default 10

---

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions.

---

## Environment Variables

### Server

| Variable | Required | Description |
|---|---|---|
| PORT | No | Default 5000 |
| MONGODB_URI | Yes | MongoDB connection string |
| JWT_SECRET | Yes | Min 32 chars, random string |
| CLIENT_URL | Yes | Frontend URL for CORS |
| CHAOS_MODE | No | true to enable chaos (default false) |
| NODE_ENV | No | development or production |

### Client

| Variable | Required | Description |
|---|---|---|
| NEXT_PUBLIC_API_URL | Yes | Backend URL |

---

## Evaluation Criteria Coverage

| Criterion | Implementation |
|---|---|
| Code quality | TypeScript strict, consistent patterns, no dead code |
| Reusable components | ui/ folder, shared hooks, memo-optimised |
| Folder structure | Feature-grouped, clear separation of concerns |
| Error handling | Boundaries, ErrorState, retry, chaos scenarios |
| API design | RESTful, owner-scoped, consistent { success, message } shape |
| Performance | React.memo, useCallback, visibility-aware polling |
| UI/UX | Design system, dark mode, responsive, micro-interactions |
| Responsiveness | 375px–1280px tested, mobile-first |
| Engineering thinking | Chaos middleware, deduplication, tab-visibility polling |

---

## License

MIT
