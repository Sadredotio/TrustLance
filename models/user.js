const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // We will hash this later
  role: { 
    type: String, 
    enum: ['client', 'freelancer', 'admin'], 
    required: true 
  },
  walletBalance: { 
    type: Number, 
    default: 0 
  }, // This simulates real money
  skills: [String], // Only for freelancers (e.g., ["React", "Node"])
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);