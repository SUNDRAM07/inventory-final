# Deployment Guide for Inventory Management Tool

This guide will help you deploy your Inventory Management Tool to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Account**: Your code should be in a GitHub repository
3. **Database**: You'll need a PostgreSQL database (recommended: Supabase, Railway, or Neon)

## Step 1: Prepare Your Repository

### Backend Deployment

1. **Database Setup**:
   - Create a PostgreSQL database (Supabase, Railway, or Neon)
   - Get your database connection string
   - Update your database schema using the `database_init.sql` file

2. **Environment Variables**:
   You'll need to set these environment variables in Vercel:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `SECRET_KEY`: A secure random string for JWT tokens
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
   - `GOOGLE_REDIRECT_URI`: Your frontend URL + `/auth/callback`

### Frontend Deployment

1. **API URL Configuration**:
   - Set `REACT_APP_API_URL` to your backend Vercel URL
   - Example: `https://your-backend-app.vercel.app`

## Step 2: Deploy Backend

1. **Connect Repository to Vercel**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   ```

2. **Deploy Backend**:
   ```bash
   # From your project root
   vercel --prod
   ```

3. **Set Environment Variables**:
   - Go to your Vercel dashboard
   - Navigate to your project settings
   - Add the environment variables listed above

## Step 3: Deploy Frontend

1. **Update API URL**:
   - Set `REACT_APP_API_URL` in Vercel environment variables
   - Point to your deployed backend URL

2. **Deploy Frontend**:
   ```bash
   # Navigate to frontend directory
   cd frontend
   
   # Deploy to Vercel
   vercel --prod
   ```

## Step 4: Configure CORS

Update your backend CORS settings in `app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend-app.vercel.app",
        "http://localhost:3000"  # For local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Step 5: Database Migration

1. **Run Database Initialization**:
   - Connect to your PostgreSQL database
   - Run the SQL commands from `database_init.sql`

2. **Create Initial Admin User**:
   ```sql
   INSERT INTO users (username, hashed_password, role) 
   VALUES ('admin', '$2b$12$...', 'ADMIN');
   ```

## Environment Variables Summary

### Backend (Vercel)
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT secret key
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GOOGLE_REDIRECT_URI`: Frontend callback URL

### Frontend (Vercel)
- `REACT_APP_API_URL`: Backend API URL

## Troubleshooting

1. **CORS Issues**: Ensure your frontend URL is in the CORS allow_origins list
2. **Database Connection**: Verify your DATABASE_URL is correct
3. **Environment Variables**: Double-check all environment variables are set in Vercel
4. **Build Errors**: Check Vercel build logs for any missing dependencies

## Post-Deployment

1. **Test All Features**:
   - User registration and login
   - Product management
   - User role management
   - Google OAuth integration

2. **Monitor Logs**:
   - Check Vercel function logs for any errors
   - Monitor database performance

3. **Set Up Monitoring**:
   - Consider adding error tracking (Sentry)
   - Set up uptime monitoring

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to your repository
2. **Database**: Use connection pooling for production databases
3. **CORS**: Only allow necessary origins
4. **Rate Limiting**: Consider adding rate limiting for production

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Test database connectivity
4. Review CORS configuration 