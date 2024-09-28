const express = require("express");
const router = express.Router();

// Prisma Client
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all bookings
router.post("/card", async (req, res) => {
  try {
    output = [];
    // count cars
    const cars = await prisma.cars.findMany();
    output.push({ title: "จำนวนรถ", value: cars.length, icon: "mdi-car-multiple", color: "primary" });
    // count customers
    const customers = await prisma.customers.findMany();
    output.push({ title: "จำนวนลูกค้า", value: customers.length, icon: "mdi-account", color: "success" });
    res.json(output);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while fetching bookings." });
  }
});

router.post("/bookingByMonth", async (req, res) => {
  try {
    const year = req.body.year;
    const bookingsByMonth = await prisma.$queryRaw`
      SELECT
        MONTH(pickup_date) as month,
        COUNT(*) as count
      FROM bookings
      WHERE YEAR(pickup_date) = ${year}
      GROUP BY month
      ORDER BY month;
    `;

    const result = bookingsByMonth.map((booking) => ({
      month: Number(booking.month),
      count: Number(booking.count),
    }));

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while fetching bookings." });
  }
});

module.exports = router;
