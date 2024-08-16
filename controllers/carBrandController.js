const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all car_brands
router.get("/", async (req, res) => {
  try {
    const car_brands = await prisma.car_brands.findMany({
      include: {
        car_models: {
          include: {
            car_sub_models: true,
          },
        },
      },
    });
    res.json(car_brands);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching car_brands." });
  }
});

// Get a car_brands by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const car_brands = await prisma.car_brands.findUnique({ where: { id: parseInt(id) } });
    if (car_brands) {
      res.json(car_brands);
    } else {
      res.status(404).json({ error: "car_brands not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the car_brands." });
  }
});

// Create a new car_brands
router.post("/", async (req, res) => {
  const data = req.body;
  try {
    const new_car_brands = await prisma.car_brands.create({
      data: data,
    });
    res.status(201).json(new_car_brands);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while creating the car_brands." });
  }
});

// Update a car_brands
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updated_car_brands = await prisma.car_brands.update({
      where: { id: parseInt(id) },
      data: data,
    });
    res.json(updated_car_brands);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the car_brands." });
  }
});

// Delete a car_brands
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    await prisma.car_brands.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while deleting the car_brands." });
  }
});

module.exports = router;
