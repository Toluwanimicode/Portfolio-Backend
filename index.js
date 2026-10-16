
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));

app.use(express.json({ limit: '10kb' }));

// Test whether the backend is running
app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio backend is running!'
  });
});

// Contact form routes
app.use('/api/contact', contactRoutes);

// Connect to MongoDB before starting the server
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
