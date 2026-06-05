import express from 'express';
import app from './src/app.js';
import dotenv from 'dotenv';
import connectDb from './src/config/db.js';

dotenv.config();
const PORT = process.env.PORT || 5000;

connectDb();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});