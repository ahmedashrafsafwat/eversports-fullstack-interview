import express from 'express';
const router = express.Router();

// Health check route
router.route('').get((req, res) => res.send('Server is up!'));

export default router;
