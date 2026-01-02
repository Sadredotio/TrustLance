const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');



const app = express();

// Middleware
app.use(express.json()); // Allows us to send JSON data
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGO_URl)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// Basic Route
app.get('/', (req, res) => {
  res.send("Escrow API is Running...");
});
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});