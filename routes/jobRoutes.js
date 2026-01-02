const express = require('express');
const router = express.Router();
const { createJob, getJobs, getMyJobs } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

// Route: /api/jobs
router.route('/')
  .get(getJobs)              // Public: Anyone can see jobs
  .post(protect, createJob); // Private: Only logged-in users can post

// Route: /api/jobs/myjobs
router.get('/myjobs', protect, getMyJobs);

module.exports = router;