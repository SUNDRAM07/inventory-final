# 🚀 GitHub to Vercel Deployment Guide

## Quick Start (5 minutes)

### 1. Backend Deployment
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import: `SUNDRAM07/inventory-final`
4. Configure:
   - **Framework**: Other
   - **Root Directory**: `./`
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)

### 2. Set Environment Variables
In Vercel dashboard → Project Settings → Environment Variables:

```
DATABASE_URL=postgresql://username:password@host:port/database
SECRET_KEY=your-super-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-frontend-app.vercel.app/auth/callback
ALLOWED_ORIGINS=https://your-frontend-app.vercel.app,http://localhost:3000
```

### 3. Frontend Deployment
1. Create another Vercel project
2. Import same repo: `SUNDRAM07/inventory-final`
3. Configure:
   - **Root Directory**: `frontend`
   - **Framework**: Create React App
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`

### 4. Frontend Environment Variables
```
REACT_APP_API_URL=https://your-backend-app.vercel.app
```

## Database Setup

### Option 1: Supabase (Recommended)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Run the SQL from `database_init.sql` in the SQL editor

### Option 2: Railway
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Add PostgreSQL service
4. Get connection string from Variables tab

### Option 3: Neon
1. Go to [neon.tech](https://neon.tech)
2. Create new project
3. Get connection string from dashboard

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-frontend-app.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for development)

## Post-Deployment

1. **Test Backend**: Visit `https://your-backend-app.vercel.app/health`
2. **Test Frontend**: Visit your frontend URL
3. **Create Admin User**: Use the registration page or add directly to database

## Troubleshooting

### Common Issues:
- **Build Fails**: Check Vercel build logs
- **CORS Errors**: Verify `ALLOWED_ORIGINS` includes your frontend URL
- **Database Connection**: Check `DATABASE_URL` format
- **Environment Variables**: Ensure all are set in Vercel dashboard

### Useful Commands:
```bash
# Check deployment status
vercel ls

# View logs
vercel logs

# Redeploy
vercel --prod
```

## URLs After Deployment

- **Backend API**: `https://your-backend-app.vercel.app`
- **Frontend App**: `https://your-frontend-app.vercel.app`
- **API Documentation**: `https://your-backend-app.vercel.app/docs`

---

**🎉 That's it! Your inventory app will be live in minutes!** 