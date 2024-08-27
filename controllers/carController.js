const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dayjs = require("dayjs");

// Get all cars
router.get("/", async (req, res) => {
  const branch_id = req.headers["branch-id"];
  const { include } = req.query;
  let includeConditions = {};
  const includeArray = include ? include.split(",") : [];
  includeArray.forEach((element) => {
    if (element === "bookings") {
      start = dayjs().startOf("day").subtract(7, "day");
      end = dayjs().endOf("day").add(60, "day");
      includeConditions[element] = {
        include: {
          booking_returns: true,
        },
        where: {
          AND: [{ pickup_date: { gte: start } }, { pickup_date: { lte: end } }],
        },
      };
    } else {
      includeConditions[element] = true;
    }
  });
  try {
    const cars = await prisma.cars.findMany({
      include: {
        branch: true,
        car_type: true,
        car_brand: true,
        car_model: true,
        car_sub_model: true,
        uploads: true,
        ...includeConditions,
      },
      where: {
        ...(branch_id && { branch_id: parseInt(branch_id) }),
      },
      orderBy: {
        car_model_id: "asc",
      },
    });
    res.json(cars);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while fetching cars." });
  }
});

// Get a cars by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const cars = await prisma.cars.findUnique({ where: { id: parseInt(id) } });
    if (cars) {
      res.json(cars);
    } else {
      res.status(404).json({ error: "cars not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the cars." });
  }
});

// Create a new cars
router.post("/", async (req, res) => {
  const data = req.body;
  try {
    const new_cars = await prisma.cars.create({
      data: data,
    });
    res.status(201).json(new_cars);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while creating the cars." });
  }
});

// Update a cars
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updated_cars = await prisma.cars.update({
      where: { id: parseInt(id) },
      data: data,
    });
    res.json(updated_cars);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the cars." });
  }
});

// Delete a cars
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    await prisma.cars.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while deleting the cars." });
  }
});

module.exports = router;
