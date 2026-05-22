# Deployment Guide

## MongoDB Atlas (Database)

1. Go to https://cloud.mongodb.com → create free M0 cluster
2. Database Access → Add user → username + password → readWriteAnyDatabase
3. Network Access → Add IP → 0.0.0.0/0 (allow all — needed for cloud deployments)
4. Connect → Drivers → copy the connection string  
   Format: `mongodb+srv://username:password@cluster.mongodb.net/taskflow`

## Server — Railway

1. Go to https://railway.app → New Project → Deploy from GitHub
2. Select the project-taskflow repo
3. Set Root Directory: `server`
4. Add environment variables:
   - `MONGODB_URI` = [your Atlas string]
   - `JWT_SECRET` = [generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`]
   - `CLIENT_URL` = [your Vercel URL — add after deploying client]
   - `CHAOS_MODE` = `true`
   - `NODE_ENV` = `production`
5. Deploy → copy the Railway URL (e.g. `https://taskflow-server.railway.app`)

## Client — Vercel

1. Go to https://vercel.com → New Project → Import from GitHub
2. Set Root Directory: `client`
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL` = [your Railway server URL]
4. Deploy → copy the Vercel URL

## Final step

Go back to Railway → update `CLIENT_URL` to your Vercel URL → redeploy server.

## Verify deployment

- Visit your Vercel URL → should show login page
- Register a new account → should land on dashboard
- Visit `[Railway URL]/health` → should return `{ "success": true, "message": "Server is running" }`

## Seed production demo user

From your machine (with `server/.env` or env vars pointing at Atlas):

```bash
cd server
MONGODB_URI="mongodb+srv://..." npm run seed
```

Demo login: `demo@taskflow.com` / `Demo@1234`
