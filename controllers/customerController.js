const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all customers
router.get("/", async (req, res) => {
  try {
    const customers = await prisma.customers.findMany();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching customers." });
  }
});

// Get a customers by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const customers = await prisma.customers.findUnique({ where: { id: parseInt(id) } });
    if (customers) {
      res.json(customers);
    } else {
      res.status(404).json({ error: "customers not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the customers." });
  }
});

// Create a new customers
router.post("/", async (req, res) => {
  const data = req.body;
  try {
    const new_customers = await prisma.customers.create({
      data: data,
    });
    res.status(201).json(new_customers);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating the customers." });
  }
});

// Update a customers
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updated_customers = await prisma.customers.update({
      where: { id: parseInt(id) },
      data: data,
    });
    res.json(updated_customers);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the customers." });
  }
});

// Delete a customers
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    await prisma.customers.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while deleting the customers." });
  }
});

module.exports = router;
