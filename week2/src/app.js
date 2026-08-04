/**
 * Express Application Setup - Week 2
 */

const express = require('express');
const cors = require('cors');
const itemRoutes = require('./routes/itemRoutes');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

const app = express();

// Core Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Timestamp Logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    program: 'Enterprise Full-Stack Development Program',
    week: 2,
    developer: 'Ahmed Osama Ezzat Ahmed Hamed',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/items', itemRoutes);

// Error Handling
app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
