const express = require('express');
const router = express.Router();
const { createContract, fundContract, releaseFunds } = require('../controllers/contractController');
const { protect } = require('../middleware/authMiddleware');

// Base Route: /api/contracts
router.post('/', protect, createContract); // Create a proposal
router.post('/:id/fund', protect, fundContract); // Client pays (Escrow starts)
router.post('/:id/release', protect, releaseFunds); // Work done, release money

module.exports = router;