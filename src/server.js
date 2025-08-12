require('dotenv').config();           
const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;  

const start = async () => {
  try {
    if (!MONGO_URI) throw new Error('MONGO_URI not set in env');

    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server is listening on port: ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
