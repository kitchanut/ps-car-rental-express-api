const express = require("express");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();

const prisma = new PrismaClient();

// GET all car brands
router.get("/", async (req, res) => {
  try {
    const carBrands = await prisma.car_brands.findMany();
    res.json(carBrands);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET a specific car brand by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const carBrand = await prisma.car_brands.findUnique({
      where: { id: parseInt(id) },
    });
    if (carBrand) {
      res.json(carBrand);
    } else {
      res.status(404).json({ error: "Car brand not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST a new car brand
router.post("/", async (req, res) => {
  const { name } = req.body;
  try {
    const newCarBrand = await prisma.car_brands.create({
      data: { name },
    });
    res.json(newCarBrand);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT/update an existing car brand
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updatedCarBrand = await prisma.car_brands.update({
      where: { id: parseInt(id) },
      data: { name },
    });
    res.json(updatedCarBrand);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE a car brand
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.car_brands.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Car brand deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
