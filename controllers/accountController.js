const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all accounts
router.get("/", async (req, res) => {
  try {
    const accounts = await prisma.accounts.findMany();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching accounts." });
  }
});

// Get a accounts by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const accounts = await prisma.accounts.findUnique({ where: { id: parseInt(id) } });
    if (accounts) {
      res.json(accounts);
    } else {
      res.status(404).json({ error: "accounts not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the accounts." });
  }
});

// Create a new accounts
router.post("/", async (req, res) => {
  const data = req.body;
  try {
    const new_accounts = await prisma.accounts.create({
      data: data,
    });
    res.status(201).json(new_accounts);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating the accounts." });
  }
});

// Update a accounts
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updated_accounts = await prisma.accounts.update({
      where: { id: parseInt(id) },
      data: data,
    });
    res.json(updated_accounts);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the accounts." });
  }
});

// Delete a accounts
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    await prisma.accounts.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while deleting the accounts." });
  }
});

module.exports = router;
