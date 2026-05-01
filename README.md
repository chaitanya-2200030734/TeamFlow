# TeamFlow - Team Task Manager

## Live URL
[link here]

## Tech Stack
- Frontend: React.js + Vite
- Backend: Node.js + Express
- Database: MongoDB Atlas
- Auth: JWT

## Features
- JWT authentication with signup, login, session restore, and logout
- Role-based access for Admin and Member users
- Project management with members, deadlines, statuses, and accent colors
- Task board with Kanban columns, priorities, due dates, tags, and assignees
- Dashboard stats, overdue alerts, status breakdown, and activity feed
- Dark and light theme using the custom TeamFlow design tokens

## Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Fill in `MONGO_URI` and set `JWT_SECRET` to a strong value before starting the API.

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## API Endpoints

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

### Projects
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/projects/:id/members`
- `DELETE /api/projects/:id/members/:userId`
- `GET /api/projects/:id/members`

### Tasks
- `GET /api/tasks`
- `GET /api/tasks/my`
- `POST /api/tasks`
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PATCH /api/tasks/:id/status`

### Users
- `GET /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

## Deployment
Railway works well for the API: create a Node service from `backend`, add the environment variables, and connect MongoDB Atlas. Deploy the frontend separately on Vercel or Netlify with `VITE_API_URL` pointing to the Railway API URL.
