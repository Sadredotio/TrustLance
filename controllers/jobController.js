const Job = require('../models/job');

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Only Clients)
const createJob = async (req, res) => {
  const { title, description, budget } = req.body;

  if (!title || !description || !budget) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  const job = await Job.create({
    title,
    description,
    budget,
    postedBy: req.user.id, // Comes from authMiddleware
    status: 'open'
  });

  res.status(201).json(job);
};

// @desc    Get all open jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  // Return only 'open' jobs, sorted by newest first
  const jobs = await Job.find({ status: 'open' })
    .populate('postedBy', 'name email') // "Join" the User table to show the name
    .sort({ createdAt: -1 });

  res.json(jobs);
};

// @desc    Get jobs posted by the logged-in user
// @route   GET /api/jobs/myjobs
// @access  Private
const getMyJobs = async (req, res) => {
  const jobs = await Job.find({ postedBy: req.user.id }).sort({ createdAt: -1 });
  res.json(jobs);
};

module.exports = { createJob, getJobs, getMyJobs };