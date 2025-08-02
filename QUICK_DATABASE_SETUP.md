# 🗄️ Quick Database Setup for Vercel Deployment

## Option 1: Supabase (Recommended - 2 minutes)

1. **Go to [supabase.com](https://supabase.com)**
2. **Click "Start your project"**
3. **Sign up with GitHub**
4. **Create new project:**
   - Name: `inventory-db`
   - Database Password: (remember this!)
   - Region: Choose closest to you
5. **Wait for setup (1-2 minutes)**
6. **Get connection string:**
   - Go to Settings → Database
   - Copy the "Connection string" (URI format)
   - Replace `[YOUR-PASSWORD]` with your actual password

**Connection string format:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

## Option 2: Railway (Alternative - 3 minutes)

1. **Go to [railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **Create new project**
4. **Add PostgreSQL service**
5. **Get connection string from Variables tab**

## Option 3: Neon (Alternative - 3 minutes)

1. **Go to [neon.tech](https://neon.tech)**
2. **Sign up with GitHub**
3. **Create new project**
4. **Get connection string from dashboard**

## 🚀 Quick Fix for Vercel Error

Once you have your database connection string:

1. **Go back to Vercel deployment page**
2. **In Environment Variables section:**
   - **Key**: `DATABASE_URL`
   - **Value**: Your PostgreSQL connection string
   - **Environment**: Production

3. **Add other required variables:**
   ```
   SECRET_KEY=your-super-secret-random-string-here
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GOOGLE_REDIRECT_URI=https://your-frontend-app.vercel.app/auth/callback
   ALLOWED_ORIGINS=https://your-frontend-app.vercel.app,http://localhost:3000
   ```

4. **Click "Deploy"**

## 🔧 Database Schema Setup

After deployment, you'll need to set up your database tables:

1. **Go to your database dashboard**
2. **Open SQL editor**
3. **Run the SQL from `database_init.sql`**

Or use this quick setup:
```sql
-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER'
);

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    quantity INTEGER DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin user (password: admin123)
INSERT INTO users (username, hashed_password, role) 
VALUES ('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3bp.gS8sDi', 'ADMIN');
```

## 🎯 Next Steps

1. **Set up database** (choose one option above)
2. **Get connection string**
3. **Add to Vercel environment variables**
4. **Deploy backend**
5. **Deploy frontend**
6. **Test application**

---

**💡 Pro Tip**: Use Supabase - it's free, fast, and perfect for this project! 