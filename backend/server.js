const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 3002;

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect(`${process.env.DB_URL}`,{});
    console.log('Connected to the database');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}

connectToDatabase();

app.use(cors());

app.use(express.json());

app.use(require('./Routes'));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});