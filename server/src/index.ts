import dotenv from 'dotenv';
// Load environment variables first
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (_req, res) => {
  res.json({ message: 'Welcome to Cafe App API' });
});

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
