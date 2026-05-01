# TeamFlow

TeamFlow is a full-stack team task manager for organizations. It helps a company create projects, invite team members, assign tasks, track progress on a Kanban board, and manage unassigned work from one clean dashboard.

## Live App

Open the deployed app here:

https://team-flow-swart.vercel.app

## Tech Stack

- Frontend: React, Vite, React Router, Axios
- Backend: Node.js, Express.js
- Database: MongoDB Atlas with Mongoose
- Authentication: JWT
- UI: Custom CSS, dark/light theme, Lucide icons
- Deployment: Vercel frontend, Render backend

## Project Workflow

TeamFlow has three main role levels:

- TeamFlow Admin: application-level admin who can view registered organizations, reset organization invite codes, and remove organizations.
- Organization Admin: manages one organization, creates projects, adds members, creates tasks, assigns work, and manages the team.
- Member: joins an organization with an invite code and works on assigned tasks.

The normal flow is:

1. A TeamFlow admin signs in and monitors organizations.
2. An organization admin creates an organization account.
3. The organization admin shares the invite code with team members.
4. Members sign up using the organization invite code.
5. The organization admin creates projects and adds members to projects.
6. The organization admin creates tasks, sets priority, due date, tags, and assignee.
7. Members see their assigned tasks and update task status.
8. Admins can filter all tasks, including unassigned tasks, to keep work from slipping.

## Main Features

- Organization registration and invite-code based member signup
- JWT login, session restore, and logout
- TeamFlow admin dashboard for organization-level control
- Organization admin dashboard with stats and overdue task alerts
- Project creation, project members, deadlines, status, and progress
- Kanban task board with Todo, In Progress, Review, and Done columns
- Task priorities, due dates, assignees, and removable creation-time tags
- Unassigned task filter for admins
- Team member management
- Dark and light theme
- Responsive layout for desktop and mobile

## Folder Structure

```text
team-task-manager/
  backend/
    config/
    controllers/
    middleware/
    models/
    routes/
    scripts/
    utils/
    server.js
  frontend/
    src/
      api/
      components/
      context/
      hooks/
      pages/
      utils/
```

## Local Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend `.env` values:

```text
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
SEED_TEAMFLOW_ADMIN=false
TEAMFLOW_ADMIN_EMAIL=teamflow@admin.com
TEAMFLOW_ADMIN_PASSWORD=change_this_password
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend `.env` value:

```text
VITE_API_URL=http://localhost:5000/api
```

## TeamFlow Admin Seeding

The backend can create the TeamFlow admin automatically during startup when this is enabled:

```text
SEED_TEAMFLOW_ADMIN=true
TEAMFLOW_ADMIN_EMAIL=teamflow@admin.com
TEAMFLOW_ADMIN_PASSWORD=your_secure_password
```

For local manual seeding:

```bash
cd backend
npm run seed:teamflow-admin
```

## API Overview

Auth:

- `POST /api/auth/register-organization`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

Organizations:

- `GET /api/organizations`
- `PATCH /api/organizations/:id/invite-code/reset`
- `DELETE /api/organizations/:id`
- `PATCH /api/organizations/invite-code/reset`

Projects:

- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/projects/:id/members`
- `DELETE /api/projects/:id/members/:userId`
- `GET /api/projects/:id/members`

Tasks:

- `GET /api/tasks`
- `GET /api/tasks/my`
- `POST /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PATCH /api/tasks/:id/status`

Users:

- `GET /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

## Deployment Notes

Backend is deployed on Render:

```text
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

Frontend is deployed on Vercel:

```text
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

Required production environment variables:

Backend:

```text
MONGO_URI
JWT_SECRET
JWT_EXPIRES_IN
CLIENT_URL
NODE_ENV
SEED_TEAMFLOW_ADMIN
TEAMFLOW_ADMIN_EMAIL
TEAMFLOW_ADMIN_PASSWORD
```

Frontend:

```text
VITE_API_URL
```

## Health Check

The backend health endpoint is:

```text
GET /health
```

It returns:

```json
{ "status": "ok", "service": "teamflow-api" }
```
