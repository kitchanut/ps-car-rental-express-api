// Initialize
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Prisma Client
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.users.findUnique({ where: { email: email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid email or password." });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "24h" });

    delete user.password;
    const output = {
      user: user,
      token: token,
    };
    res.json(output);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while Login" });
  }
});

module.exports = router;
