const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true }, // The agreed price
  
  // THE MOST CRITICAL PART: THE ESCROW STATES
  status: { 
    type: String, 
    enum: [
        'new',                // Agreed, but not funded yet
        'active',             // Client deposited money (Escrow holds it)
        'submission_pending', // Freelancer finished work, waiting for approval
        'released',           // Client approved, money sent to Freelancer
        'disputed',           // Something went wrong, Admin needs to check
        'cancelled'           // Contract killed before work started
    ],
    default: 'new'
  },
  terms: { type: String } // e.g., "Must be delivered by Friday"
}, { timestamps: true });

module.exports = mongoose.model('Contract', contractSchema);