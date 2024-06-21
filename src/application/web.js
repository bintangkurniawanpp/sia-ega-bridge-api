// Setup
import cors from 'cors';
import express from 'express';
import tokenMiddleware from '../middleware/auth.js';
import testRoutes from '../routes/testRoutes.js';

const web = express();

// Apply middleware
web.use(cors());          // Enable Cross-Origin Resource Sharing (CORS) for security
web.use(express.json());
web.use('/api/v1/', tokenMiddleware);

// Route
web.use('/api/v1/test', testRoutes);


export default web;
