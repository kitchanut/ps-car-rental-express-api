const express = require("express");
const router = express.Router();

// Prisma Client
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all bookings
router.post("/bookingsByMonth", async (req, res) => {
  try {
    const year = req.body.year;

    const bookingsByMonth = await prisma.$queryRaw`
      SELECT
        car_id,
        MONTH(pickup_date) as month,
        COUNT(*) as count
      FROM bookings
      WHERE YEAR(pickup_date) = ${year}
      GROUP BY car_id,month
      ORDER BY month;
    `;

    // console.log(bookingsByMonth);

    const result = bookingsByMonth.map((booking) => ({
      car_id: Number(booking.car_id),
      month: Number(booking.month),
      count: Number(booking.count),
    }));

    console.log(result);

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while fetching bookings." });
  }
});

module.exports = router;
