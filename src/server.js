require('dotenv').config();       // Load .env variables
const mongoose = require('mongoose');
const { PORT = 8000, MONGODB_URI } = process.env;
const app = require("./app");

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`Listening on Port ${PORT}!`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
