// Setup
import cors from 'cors';
import express from 'express';
import arisRouter from '../routes/api.js';
import logger from './logger.js'; // Ensure logger is imported

const web = express();

// Apply middleware for parsing JSON and CORS
web.use(cors());          
web.use(express.json());


// Route
// web.use('/api/v1/test', testRoutes);
web.use('/api/v1', arisRouter);

web.use((err, req, res, next) => {
    logger.error(err.message);
    res.status(500).send('Internal Server Error');
  });



export default web;
