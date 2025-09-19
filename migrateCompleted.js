const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env

// Import Project model
const Project = require("./src/models/Project");

async function migrate() {
  try {
    // Connect to MongoDB using the URI from .env
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Update all projects where steps don't have the "completed" field
    const result = await Project.updateMany(
      { "steps.completed": { $exists: false } },
      { $set: { "steps.$[].completed": false } }
    );

    console.log(
      `🔄 Migration finished. Modified ${result.modifiedCount} project documents.`
    );

    // Disconnect after migration
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

migrate();
