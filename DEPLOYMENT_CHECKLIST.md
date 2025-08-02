# 🚀 Vercel Deployment Checklist

## Pre-Deployment Setup

- [ ] **Database Setup**
  - [ ] Create PostgreSQL database (Supabase/Railway/Neon)
  - [ ] Get database connection string
  - [ ] Run `database_init.sql` on your database

- [ ] **Google OAuth Setup**
  - [ ] Create Google OAuth credentials
  - [ ] Get Client ID and Client Secret
  - [ ] Set redirect URI to your frontend URL + `/auth/callback`

- [ ] **Vercel Account**
  - [ ] Sign up at [vercel.com](https://vercel.com)
  - [ ] Install Vercel CLI: `npm i -g vercel`
  - [ ] Login: `vercel login`

## Deployment Steps

### 1. Deploy Backend
- [ ] Run: `./deploy.sh` or `vercel --prod`
- [ ] Note the backend URL (e.g., `https://your-app.vercel.app`)

### 2. Configure Environment Variables (Backend)
In Vercel dashboard → Project Settings → Environment Variables:
- [ ] `DATABASE_URL` = Your PostgreSQL connection string
- [ ] `SECRET_KEY` = Random secure string for JWT
- [ ] `GOOGLE_CLIENT_ID` = Your Google OAuth client ID
- [ ] `GOOGLE_CLIENT_SECRET` = Your Google OAuth client secret
- [ ] `GOOGLE_REDIRECT_URI` = Your frontend URL + `/auth/callback`
- [ ] `ALLOWED_ORIGINS` = Your frontend URL (comma-separated if multiple)

### 3. Deploy Frontend
- [ ] Run: `cd frontend && vercel --prod`
- [ ] Note the frontend URL

### 4. Configure Frontend Environment Variables
In Vercel dashboard → Frontend Project Settings → Environment Variables:
- [ ] `REACT_APP_API_URL` = Your backend URL

### 5. Update CORS Settings
- [ ] Update `ALLOWED_ORIGINS` in backend to include your frontend URL
- [ ] Redeploy backend if needed

## Post-Deployment Testing

- [ ] **Test User Registration/Login**
  - [ ] Create a new user account
  - [ ] Test login functionality
  - [ ] Test Google OAuth login

- [ ] **Test Product Management**
  - [ ] Add a new product
  - [ ] Update product quantity
  - [ ] View product list

- [ ] **Test User Management** (Admin only)
  - [ ] View all users
  - [ ] Update user roles
  - [ ] Delete users

- [ ] **Test Analytics**
  - [ ] View dashboard analytics
  - [ ] Check charts and statistics

## Troubleshooting

### Common Issues:
- [ ] **CORS Errors**: Check `ALLOWED_ORIGINS` environment variable
- [ ] **Database Connection**: Verify `DATABASE_URL` is correct
- [ ] **Build Errors**: Check Vercel build logs
- [ ] **Environment Variables**: Ensure all variables are set in Vercel

### Debug Commands:
```bash
# Check Vercel deployment status
vercel ls

# View deployment logs
vercel logs

# Redeploy if needed
vercel --prod
```

## Security Checklist

- [ ] **Environment Variables**: All sensitive data is in Vercel env vars
- [ ] **Database**: Using production-ready PostgreSQL
- [ ] **CORS**: Only allowing necessary origins
- [ ] **HTTPS**: All URLs use HTTPS
- [ ] **Secrets**: No secrets in code repository

## Performance Optimization

- [ ] **Database**: Using connection pooling
- [ ] **Caching**: Consider adding Redis for caching
- [ ] **CDN**: Vercel provides automatic CDN
- [ ] **Monitoring**: Set up error tracking (optional)

---

**🎉 Your inventory management tool is now live!**

**Frontend URL**: `https://your-frontend-app.vercel.app`
**Backend URL**: `https://your-backend-app.vercel.app` 