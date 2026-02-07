import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js';
import productRoutes from './ProductRoutes/ProductRoutes.js';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import Product from './ProductModel/Product.js';

// Resolve __dirname in ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/products', productRoutes);

// Serve static files
app.use('/data', express.static(path.join(__dirname, 'data')));

// Base route
app.get('/', (req, res) => {
  res.send('<h1>Welcome to Product API</h1><p>Visit <a href="/api/products">/api/products</a> to see products.</p>');
});

// 404 for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {},
  });
});

// Load products.json into DB on startup
const loadInitialData = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const filePath = path.join(__dirname, 'data', 'products.json');
      const data = fs.readFileSync(filePath, 'utf-8');
      const products = JSON.parse(data);
      await Product.insertMany(products);
    //   console.log(`${products.length} products loaded from products.json`);
    } else {
    //   console.log('Products already exist in DB, skipping seed.');
    }
  } catch (err) {
    console.error('Error loading initial data:', err.message);
  }
};

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  loadInitialData();
});