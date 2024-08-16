const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all car_sub_models
router.get("/", async (req, res) => {
  try {
    const car_sub_models = await prisma.car_sub_models.findMany();
    res.json(car_sub_models);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching car_sub_models." });
  }
});

// Get a car_sub_models by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const car_sub_models = await prisma.car_sub_models.findUnique({ where: { id: parseInt(id) } });
    if (car_sub_models) {
      res.json(car_sub_models);
    } else {
      res.status(404).json({ error: "car_sub_models not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the car_sub_models." });
  }
});

// Create a new car_sub_models
router.post("/", async (req, res) => {
  const data = req.body;
  try {
    const new_car_sub_models = await prisma.car_sub_models.create({
      data: data,
    });
    res.status(201).json(new_car_sub_models);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating the car_sub_models." });
  }
});

// Update a car_sub_models
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updated_car_sub_models = await prisma.car_sub_models.update({
      where: { id: parseInt(id) },
      data: data,
    });
    res.json(updated_car_sub_models);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the car_sub_models." });
  }
});

// Delete a car_sub_models
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    await prisma.car_sub_models.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while deleting the car_sub_models." });
  }
});

module.exports = router;
