const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Upload
const uploadMiddleware = require("../middleware/uploadMiddleware");

// Get all booking_returns
router.get("/", async (req, res) => {
  try {
    const { booking_id } = req.query;
    const booking_returns = await prisma.booking_returns.findMany({
      include: {
        booking: {
          include: {
            uploads: {
              where: { type: "คืนรถ" },
            },
          },
        },
      },
      where: {
        ...(booking_id && { booking_id: parseInt(booking_id) }),
      },
    });
    res.json(booking_returns);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching booking_returns." });
  }
});

// Get a booking_returns by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const booking_returns = await prisma.booking_returns.findUnique({ where: { id: parseInt(id) } });
    if (booking_returns) {
      res.json(booking_returns);
    } else {
      res.status(404).json({ error: "booking_returns not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the booking_returns." });
  }
});

// Create a new booking_returns
router.post("/", uploadMiddleware({}), async (req, res) => {
  const data = req.body;
  try {
    const new_booking_returns = await prisma.booking_returns.create({
      data: {
        booking_id: parseInt(data.booking_id),
        return_penalty: parseInt(data.return_penalty),
        return_date: new Date(data.return_date).toISOString(),
        ...(data.return_note && { return_note: data.return_note }),
      },
    });
    const files = req.files;
    if (files.length > 0) {
      const fileData = files.map((file, index) => ({
        booking_id: new_booking_returns.booking_id,
        type: "คืนรถ",
        file_name: file.originalname,
        extension: file.mimetype,
        file_path: file.path,
      }));
      await prisma.uploads.createMany({ data: fileData });
    }
    res.status(200).json(new_booking_returns);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while creating the booking_returns." });
  }
});

// Update a booking_returns
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updated_booking_returns = await prisma.booking_returns.update({
      where: { id: parseInt(id) },
      data: {
        return_penalty: parseInt(data.return_penalty),
        return_date: new Date(data.return_date).toISOString(),
        ...(data.return_note && { return_note: data.return_note }),
      },
    });
    res.json(updated_booking_returns);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while updating the booking_returns." });
  }
});

// Delete a booking_returns
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    await prisma.booking_returns.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while deleting the booking_returns." });
  }
});

module.exports = router;
