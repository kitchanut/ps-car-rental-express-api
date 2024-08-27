const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dayjs = require("dayjs");

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
    const branch_id = req.headers["Branch_id"];
    const { query_period_by, period, status, include } = req.query;

    let start, end;
    if (period == "D") {
      start = dayjs().startOf("day");
      end = dayjs().endOf("day");
    } else if (period == "W") {
      start = dayjs().startOf("week");
      end = dayjs().endOf("week");
    } else if (period == "M") {
      start = dayjs().startOf("month");
      end = dayjs().endOf("month");
    } else if (period == "3M") {
      start = dayjs().startOf("month").subtract(3, "month");
      end = dayjs().endOf("month");
    } else if (period == "6M") {
      start = dayjs().startOf("month").subtract(6, "month");
      end = dayjs().endOf("month");
    } else if (period == "Y") {
      start = dayjs().startOf("year");
      end = dayjs().endOf("year");
    } else if (period == "2Y") {
      start = dayjs().startOf("year").subtract(1, "year");
      end = dayjs().endOf("year");
    } else if (period == "3Y") {
      start = dayjs().startOf("year").subtract(2, "year");
      end = dayjs().endOf("year");
    } else if (period == "lastDay") {
      start = dayjs().subtract(1, "day").startOf("day");
      end = dayjs().subtract(1, "day").endOf("day");
    } else if (period == "nextDay") {
      start = dayjs().add(1, "day").startOf("day");
      end = dayjs().add(1, "day").endOf("day");
    }

    // query ตามสถานะ
    const statusArray = status ? status.split(",") : [];
    const statusCondition = statusArray.length > 0 ? { booking_status: { in: statusArray } } : {};

    // Include ตามที่ระบุ
    let includeConditions = {};
    const includeArray = include ? include.split(",") : [];
    includeArray.forEach((element) => {
      includeConditions[element] = true;
    });

    let dateConditions = [];
    let orderByCondition = [];
    if (query_period_by === "booking_date") {
      dateConditions.push({ booking_date: { gte: start } });
      dateConditions.push({ booking_date: { lte: end } });
      orderByCondition.push({ booking_date: "desc" });
    } else if (query_period_by === "pickup_date") {
      dateConditions.push({ pickup_date: { gte: start } });
      dateConditions.push({ pickup_date: { lte: end } });
      orderByCondition.push({ pickup_date: "desc" });
    } else if (query_period_by === "return_date") {
      dateConditions.push({ return_date: { gte: start } });
      dateConditions.push({ return_date: { lte: end } });
      orderByCondition.push({ return_date: "desc" });
    }

    const whereClause = {
      ...(branch_id && { branch_id: parseInt(branch_id) }),
      ...statusCondition,
      AND: dateConditions,
    };

    const bookings = await prisma.bookings.findMany({
      include: {
        customer: true,
        pickup_branch: true,
        return_branch: true,
        car: {
          include: {
            car_model: true,
          },
        },
        ...includeConditions,
      },
      where: whereClause,
      orderBy: orderByCondition,
    });
    res.json(bookings);
  } catch (error) {
    console.log(error);
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
  data.booking_date = new Date(data.booking_date).toISOString();
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
  let data = req.body;
  data.booking_date ? (data.booking_date = new Date(data.booking_date).toISOString()) : "";
  data.pickup_date ? (data.pickup_date = new Date(data.pickup_date).toISOString()) : "";
  data.return_date ? (data.return_date = new Date(data.return_date).toISOString()) : "";
  try {
    const updated_bookings = await prisma.bookings.update({
      where: { id: parseInt(id) },
      data: data,
    });
    res.json(updated_bookings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while updating the bookings." });
  }
});

// Delete a bookings
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
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
