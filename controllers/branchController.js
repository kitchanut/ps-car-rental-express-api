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

// Get a branches by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const branches = await prisma.branches.findUnique({ where: { id: parseInt(id) } });
    if (branches) {
      res.json(branches);
    } else {
      res.status(404).json({ error: "branches not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the branches." });
  }
});

// Create a new branches
router.post("/", async (req, res) => {
  const data = req.body;
  try {
    const new_branches = await prisma.branches.create({
      data: data,
    });
    res.status(201).json(new_branches);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating the branches." });
  }
});

// Update a branches
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updated_branches = await prisma.branches.update({
      where: { id: parseInt(id) },
      data: data,
    });
    res.json(updated_branches);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the branches." });
  }
});

// Delete a branches
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    await prisma.branches.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while deleting the branches." });
  }
});

module.exports = router;
