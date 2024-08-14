const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  omit: {
    users: {
      password: true,
    },
  },
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      include: {
        branch: true,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching users." });
  }
});

// Get a user by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.users.findUnique({
      where: { id: parseInt(id) },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the user." });
  }
});

// Create a new user
router.post("/", async (req, res) => {
  let data = req.body;
  const user = await await prisma.users.findUnique({
    where: {
      email: data.email,
    },
  });
  if (user) {
    return res.status(422).json({ message: "User already exists" });
  } else {
    data.password = await bcrypt.hash(data.password, 10);
    const new_users = await prisma.users.create({
      data: data,
    });
    return res.status(201).json(new_users);
  }
});

// Update a user
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  let data = req.body;
  try {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const updatedUser = await prisma.users.update({
      where: { id: parseInt(id) },
      data: data,
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the user." });
  }
});

// Delete a user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.users.delete({ where: { id: parseInt(id) } });
    res.status(200).end();
  } catch (error) {
    res.status(500).json({ error: "An error occurred while deleting the user." });
  }
});

module.exports = router;
