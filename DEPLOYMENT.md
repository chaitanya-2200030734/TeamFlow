# TeamFlow Deployment

Recommended deployment:
- Backend: Render Web Service
- Frontend: Vercel
- Database: MongoDB Atlas

## 1. Deploy Backend on Render

Create a new Render Web Service from this GitHub repo.

Use these settings:

```text
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
Branch: main
```

Add these environment variables in Render:

```text
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<strong random secret, 32+ characters>
JWT_EXPIRES_IN=7d
CLIENT_URL=<your Vercel frontend URL>
NODE_ENV=production
```

Render provides `PORT`, so you do not need to set it.

After the backend is live, open:

```text
https://<your-render-service>.onrender.com/health
```

You should see:

```json
{ "status": "ok", "service": "teamflow-api" }
```

## 2. Seed TeamFlow Admin

After the Render backend deploys successfully, open the Render service shell and run:

```bash
npm run seed:teamflow-admin
```

This creates or updates:

```text
Email: teamflow@admin.com
Password: admin@1234
```

Change this password after first login before using the app seriously.

## 3. Deploy Frontend on Vercel

Create a new Vercel project from this GitHub repo.

Use these settings:

```text
Root Directory: frontend
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Branch: main
```

Add this environment variable in Vercel:

```text
VITE_API_URL=https://<your-render-service>.onrender.com/api
```

Redeploy the frontend after setting `VITE_API_URL`.

## 4. Final Backend CORS Update

After Vercel gives you the final frontend URL, update the Render backend environment variable:

```text
CLIENT_URL=https://<your-vercel-app>.vercel.app
```

Then redeploy/restart the Render backend.

## 5. Smoke Test

Check these after deployment:

1. Open the Vercel app.
2. Login as `teamflow@admin.com`.
3. Confirm `/teamflow-admin` loads organizations.
4. Create a test organization from signup/register flow.
5. Login as that organization admin.
6. Create a project and task.
7. Filter tasks by unassigned.

