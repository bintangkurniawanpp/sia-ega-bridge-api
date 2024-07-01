// Setup
import cors from 'cors';
import express from 'express';
import arisRouter from '../routes/api.js';


const web = express();

// Apply middleware for parsing JSON and CORS
web.use(cors());          
web.use(express.json());


// Route
// web.use('/api/v1/test', testRoutes);
web.use('/api/v1', arisRouter);



export default web;
