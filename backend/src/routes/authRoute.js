import express from 'express';
import { login, logout, refreshToken, register } from '../controller/authController.js';

const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Logout route
router.post('/logout', logout);

// Refresh token route 
router.post('/refresh', refreshToken);
export default router;