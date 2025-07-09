const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectDb = require('./database/Database');
const userRoutes = require('./routes/UserRoutes');
const captainRoutes = require('./routes/CaptainRoutes');
const cookieParser = require('cookie-parser');

// Allow frontend requests from localhost:3000
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection
connectDb();

// Default route
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Routes
app.use('/users', userRoutes);
app.use('/captains', captainRoutes);

module.exports = app;
