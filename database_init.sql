-- Inventory Management Tool Database Initialization Script
-- This script creates the database schema for the inventory management system

-- Create database (run this as superuser)
-- CREATE DATABASE inventory_db;

-- Connect to the database
-- \c inventory_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    sku VARCHAR(255) UNIQUE NOT NULL,
    image_url TEXT,
    description TEXT,
    quantity INTEGER DEFAULT 0 NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Insert sample data (optional)
-- INSERT INTO users (username, hashed_password) VALUES 
-- ('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJQKz6.'); -- password: admin123

-- INSERT INTO products (name, type, sku, image_url, description, quantity, price) VALUES 
-- ('Sample Product', 'Electronics', 'SAMPLE-001', 'https://example.com/sample.jpg', 'A sample product for testing', 10, 99.99);

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user; 