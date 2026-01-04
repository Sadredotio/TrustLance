const Contract = require('../models/contract');
const User = require('../models/User');
const Job = require('../models/job');

// @desc    Create a new Contract Proposal
// @route   POST /api/contracts
// @access  Private
const createContract = async (req, res) => {
  const { jobId, freelancerId, amount, terms } = req.body;

  // 1. Validation
  if (!jobId || !freelancerId || !amount) {
    return res.status(400).json({ message: 'Missing required fields! Please field all details' });
  }

  // 2. Create the Contract (Status: "new")
  const contract = await Contract.create({
    jobId,
    clientId: req.user.id, // The logged-in user is the Client
    freelancerId,
    amount,
    terms,
    status: 'new'
  });

  res.status(201).json(contract);
};

// @desc    Client deposits money into Escrow
// @route   POST /api/contracts/:id/fund
// @access  Private (Client Only)
const fundContract = async (req, res) => {
  const contractId = req.params.id;

  try {
    // 1. Find the Contract
    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    // 2. Find the Client (User)
    const client = await User.findById(req.user.id);

    // 3. Security Checks
    if (contract.clientId.toString() !== client._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to fund this contract' });
    }
    if (contract.status !== 'new') {
      return res.status(400).json({ message: 'Contract is already funded or closed' });
    }
    if (client.walletBalance < contract.amount) {
      return res.status(400).json({ message: 'Insufficient funds in wallet' });
    }

    // --- THE TRANSACTION LOGIC ---
    
    // A. Deduct money from Client
    client.walletBalance -= contract.amount;
    await client.save();

    // B. Update Contract Status to "Active" (Money is now in Escrow)
    contract.status = 'active';
    await contract.save();

    // C. Update Job Status
    await Job.findByIdAndUpdate(contract.jobId, { status: 'in_progress' });

    res.json({ 
      message: 'Contract funded successfully', 
      newBalance: client.walletBalance,
      contractStatus: contract.status 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Release funds to Freelancer
// @route   POST /api/contracts/:id/release
// @access  Private (Client Only)
const releaseFunds = async (req, res) => {
  const contractId = req.params.id;

  try {
    const contract = await Contract.findById(contractId);
    if (!contract || contract.status !== 'active') {
      return res.status(400).json({ message: 'Contract not active or found' });
    }

    // Verify User is the Client
    if (contract.clientId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized!Use correct credentials' });
    }

    // --- THE RELEASE LOGIC ---

    // 1. Find Freelancer
    const freelancer = await User.findById(contract.freelancerId);
    
    // 2. Add Money to Freelancer
    freelancer.walletBalance += contract.amount;
    await freelancer.save();

    // 3. Close Contract
    contract.status = 'released';
    await contract.save();

    // 4. Close Job
    await Job.findByIdAndUpdate(contract.jobId, { status: 'closed' });

    res.json({ message: 'Funds released! Freelancer has been paid.' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createContract, fundContract, releaseFunds };