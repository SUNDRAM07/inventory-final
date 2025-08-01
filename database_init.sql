-- Database initialization script for Inventory Management Tool
-- This script creates the necessary tables and indexes for the application

-- Create user roles enum type
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'user');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'user' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    sku VARCHAR(100) UNIQUE NOT NULL,
    image_url TEXT,
    description TEXT,
    quantity INTEGER DEFAULT 0 NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_type ON products(type);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);

-- Insert pre-created accounts
-- Admin account: SAdmin / 12345qwerty
INSERT INTO users (username, hashed_password, role) VALUES 
('SAdmin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJQKz6.', 'admin');

-- Manager account: Manager1 / manager123
INSERT INTO users (username, hashed_password, role) VALUES 
('Manager1', '$2b$12$GxVn1hU58eUtfXa4X112Au5NpEnNNA1u9qIofylg7imaFOhqWDyNe', 'manager');

-- User account: User1 / user123
INSERT INTO users (username, hashed_password, role) VALUES 
('User1', '$2b$12$HxVn1hU58eUtfXa4X112Au5NpEnNNA1u9qIofylg7imaFOhqWDyNe', 'user');

-- Insert sample product data
INSERT INTO products (name, type, sku, image_url, description, quantity, price) VALUES
('iPhone 15 Pro', 'Electronics', 'IPH-001', 'https://example.com/iphone.jpg', 'Latest iPhone model', 50, 999.99),
('MacBook Air', 'Electronics', 'MAC-001', 'https://example.com/macbook.jpg', 'Lightweight laptop', 25, 1299.99),
('Office Chair', 'Furniture', 'CHAIR-001', 'https://example.com/chair.jpg', 'Ergonomic office chair', 100, 199.99),
('Coffee Maker', 'Appliances', 'COFFEE-001', 'https://example.com/coffee.jpg', 'Automatic coffee machine', 30, 89.99),
('Desk Lamp', 'Furniture', 'LAMP-001', 'https://example.com/lamp.jpg', 'LED desk lamp', 75, 49.99); 