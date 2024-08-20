const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Upload
const upload = require("./storageController");

// Get all booking_pickups
router.get("/", async (req, res) => {
  try {
    const { booking_id } = req.query;
    const booking_pickups = await prisma.booking_pickups.findMany({
      include: {
        booking: true,
      },
      where: {
        ...(booking_id && { booking_id: parseInt(booking_id) }),
      },
    });
    res.json(booking_pickups);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching booking_pickups." });
  }
});

// Get a booking_pickups by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const booking_pickups = await prisma.booking_pickups.findUnique({ where: { id: parseInt(id) } });
    if (booking_pickups) {
      res.json(booking_pickups);
    } else {
      res.status(404).json({ error: "booking_pickups not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the booking_pickups." });
  }
});

// Create a new booking_pickups
router.post("/", upload.single("file"), async (req, res) => {
  const data = req.body;
  try {
    const new_booking_pickups = await prisma.booking_pickups.create({
      data: {
        booking_id: parseInt(data.booking_id),
        pickup_date: new Date(data.pickup_date).toISOString(),
        ...(data.pickup_note && { pickup_note: data.pickup_note }),
      },
    });
    if (req.file) {
      const fileData = {
        booking_id: new_booking_pickups.booking_id,
        type: "รับรถ",
        file_name: req.file.originalname,
        extension: req.file.mimetype,
        file_path: req.file.path,
      };
      await prisma.uploads.create({ data: fileData });
    }
    res.status(201).json(new_booking_pickups);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while creating the booking_pickups." });
  }
});

// Update a booking_pickups
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updated_booking_pickups = await prisma.booking_pickups.update({
      where: { id: parseInt(id) },
      data: {
        pickup_date: new Date(data.pickup_date).toISOString(),
        ...(data.pickup_note && { pickup_note: data.pickup_note }),
      },
    });
    res.json(updated_booking_pickups);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the booking_pickups." });
  }
});

// Delete a booking_pickups
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    await prisma.booking_pickups.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while deleting the booking_pickups." });
  }
});

module.exports = router;
