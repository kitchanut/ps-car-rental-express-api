const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all car_types
router.get("/", async (req, res) => {
  try {
    const car_types = await prisma.car_types.findMany();
    res.json(car_types);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching car_types." });
  }
});

// Get a car_types by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const car_types = await prisma.car_types.findUnique({ where: { id: parseInt(id) } });
    if (car_types) {
      res.json(car_types);
    } else {
      res.status(404).json({ error: "car_types not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the car_types." });
  }
});

// Create a new car_types
router.post("/", async (req, res) => {
  const data = req.body;
  try {
    const new_car_types = await prisma.car_types.create({
      data: data,
    });
    res.status(201).json(new_car_types);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating the car_types." });
  }
});

// Update a car_types
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updated_car_types = await prisma.car_types.update({
      where: { id: parseInt(id) },
      data: data,
    });
    res.json(updated_car_types);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the car_types." });
  }
});

// Delete a car_types
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    await prisma.car_types.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while deleting the car_types." });
  }
});

module.exports = router;
