import dotenv from 'dotenv';
import path from 'path';
// Load environment variables first
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, '../public')));

// Basic route with HTML
app.get('/', (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cafe App API</title>
        <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body>
        <div class="container">
            <h1>Welcome to Cafe App API</h1>
            <p>Server is running successfully!</p>
        </div>
    </body>
    </html>
  `);
});

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
