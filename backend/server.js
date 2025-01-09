import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import User from './Models/userModel.js';
import ConnectDB from './dbConfig/db.js';
import UserRouter from './Routes/userRoutes.js';

const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization','token','x-auth-token', 'password', 'newPassword', 'confirmPassword', 'new-password', 'confirm-password', 'username'],
  credentials: true
}));
// Sync Database
ConnectDB.sync({ alter: true })
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Error syncing database:', err));

// Routes
app.use('/api', UserRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
