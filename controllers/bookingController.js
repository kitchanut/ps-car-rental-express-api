const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function generateBookingNumber() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  let bookingNumber = "";

  // สุ่มตัวอักษร 2 ตัว
  for (let i = 0; i < 2; i++) {
    bookingNumber += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  // สุ่มตัวเลข 4 ตัว
  for (let i = 0; i < 4; i++) {
    bookingNumber += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return bookingNumber;
}

// Get all bookings
router.get("/", async (req, res) => {
  try {
    const bookings = await prisma.bookings.findMany();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching bookings." });
  }
});

// Get a bookings by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const bookings = await prisma.bookings.findUnique({ where: { id: parseInt(id) } });
    if (bookings) {
      res.json(bookings);
    } else {
      res.status(404).json({ error: "bookings not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the bookings." });
  }
});

// Create a new bookings
router.post("/", async (req, res) => {
  const data = req.body;
  data.booking_number = generateBookingNumber();
  data.booking_status = "จอง";
  data.pickup_date = new Date(data.pickup_date).toISOString();
  data.return_date = new Date(data.return_date).toISOString();
  try {
    const new_bookings = await prisma.bookings.create({
      data: data,
    });
    res.status(201).json(new_bookings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while creating the bookings." });
  }
});

// Update a bookings
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updated_bookings = await prisma.bookings.update({
      where: { id: parseInt(id) },
      data: data,
    });
    res.json(updated_bookings);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the bookings." });
  }
});

// Delete a bookings
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    await prisma.bookings.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while deleting the bookings." });
  }
});

module.exports = router;
