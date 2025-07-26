const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ Register a new user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields are required." });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists." });

    const user = new User({ name, email, password, approved: false });
    await user.save();

    res.status(200).json({ message: "Registration request submitted for approval." });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get pending (unapproved) users
router.get("/pending", async (req, res) => {
  try {
    const users = await User.find({ approved: false });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Approve user by ID
router.patch("/approve/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { approved: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User approved successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

const jwt = require("jsonwebtoken");

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required." });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found." });

    if (!user.approved)
      return res.status(403).json({ message: "User not approved yet." });

    if (user.password !== password)  // 🔐 You can improve this later using bcrypt
      return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
