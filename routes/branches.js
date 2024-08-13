const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all branches
router.get("/", async (req, res) => {
  try {
    const branches = await prisma.branches.findMany();
    res.json(branches);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching branches." });
  }
});

// Get a user by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await prisma.branches.findUnique({ where: { id: parseInt(id) } });
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
  const data = req.body;
  try {
    const newUser = await prisma.branches.create({
      data: data,
    });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating the user." });
  }
});

// Update a user
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updatedUser = await prisma.branches.update({
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
    await prisma.branches.delete({ where: { id: parseInt(id) } });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "An error occurred while deleting the user." });
  }
});

module.exports = router;
