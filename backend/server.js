const express = require('express');
const mongoose = require('mongoose');
const cors=require('cors');

const app = express();
const port = 3002; 
// Connect to MongoDB
async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/AccuSport', {
      useNewUrlParser: true,
      useUnifiedTopology: true, 
    });
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