const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all car_models
router.get("/", async (req, res) => {
  try {
    const car_models = await prisma.car_models.findMany();
    res.json(car_models);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching car_models." });
  }
});

// Get a car_models by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const car_models = await prisma.car_models.findUnique({ where: { id: parseInt(id) } });
    if (car_models) {
      res.json(car_models);
    } else {
      res.status(404).json({ error: "car_models not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the car_models." });
  }
});

// Create a new car_models
router.post("/", async (req, res) => {
  const data = req.body;
  try {
    const new_car_models = await prisma.car_models.create({
      data: data,
    });
    res.status(201).json(new_car_models);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating the car_models." });
  }
});

// Update a car_models
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updated_car_models = await prisma.car_models.update({
      where: { id: parseInt(id) },
      data: data,
    });
    res.json(updated_car_models);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the car_models." });
  }
});

// Delete a car_models
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    await prisma.car_models.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while deleting the car_models." });
  }
});

module.exports = router;
