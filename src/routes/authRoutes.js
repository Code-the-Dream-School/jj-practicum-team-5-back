const express = require("express");
const router = express.Router();

const loginTheUser = require("../controllers/loginController");
const User = require("../models/user");

router.post("/", async (req, res) => {
  try {
    const { first, last, email, password } = req.body;

    if (!first || !last || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const newUser = await User.create({
      first,
      last,
      email,
      password,
    });

    const token = newUser.createJWT();

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        first: newUser.first,
        last: newUser.last,
        email: newUser.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/loginUser", loginTheUser);

router.post("/check-email", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ exists: true });
    }

    return res.json({ exists: false });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
