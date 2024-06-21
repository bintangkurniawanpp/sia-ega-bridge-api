import express from 'express';
import TestController from '../controllers/testController.js';
// import tokenMiddleware from '../middleware/tokenMiddleware';

const router = express.Router();

// Add the test endpoint
router.get('/get-group-children', TestController.testGetGroupChildren);

export default router;