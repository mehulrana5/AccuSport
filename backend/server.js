const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors');
require('dotenv').config()
const rateLimit = require('express-rate-limit');

const app = express();
const port = process.env.PORT || 3002;

// Function to add api call rate limit for all routes
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per minute
  message: 'Too many requests, please try again later.'
});

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(`${process.env.DB_URL}`,{});
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

// Apply the rate limiter globally to all routes
app.use(globalLimiter);

connectToDatabase();

app.use(cors());

app.use(express.json());

app.use(require('./Routes'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});