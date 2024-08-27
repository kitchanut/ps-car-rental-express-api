const express = require("express");
const router = express.Router();
const dayjs = require("dayjs");

const uploadMiddleware = require("../middleware/uploadMiddleware");

const fs = require("fs");
const path = require("path");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all account_transactions
router.get("/", async (req, res) => {
  try {
    // get query parameters
    const { account_id, booking_id, car_id, transaction_type, period } = req.query;
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
    }
    const account_transactions = await prisma.account_transactions.findMany({
      include: {
        uploads: true,
        account: true,
        booking: true,
      },
      where: {
        ...(account_id && { account_id: parseInt(account_id) }),
        ...(booking_id && { booking_id: parseInt(booking_id) }),
        ...(car_id && { car_id: parseInt(car_id) }),
        ...(transaction_type && { transaction_type: transaction_type }),
        AND: [{ transaction_date: { gte: start } }, { transaction_date: { lte: end } }],
      },
      orderBy: [{ transaction_date: "desc" }],
    });
    res.json(account_transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while fetching account_transactions." });
  }
});

// Get a account_transactions by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const account_transactions = await prisma.account_transactions.findUnique({ where: { id: parseInt(id) } });
    if (account_transactions) {
      res.json(account_transactions);
    } else {
      res.status(404).json({ error: "account_transactions not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the account_transactions." });
  }
});

// Create a new account_transactions
router.post("/", uploadMiddleware({}), async (req, res) => {
  const data = req.body;
  try {
    const account_transactions = await prisma.account_transactions.create({
      data: {
        account_id: parseInt(data.account_id),
        ...(data.booking_id && { booking_id: parseInt(data.booking_id) }),
        ...(data.car_id && { car_id: parseInt(data.car_id) }),
        transaction_type: data.transaction_type,
        transaction_date: new Date(data.transaction_date).toISOString(),
        transaction_amount: parseInt(data.transaction_amount),
        transaction_note: data.transaction_note ?? null,
      },
    });

    if (req.files.length) {
      const fileData = req.files.map((file, index) => ({
        account_transaction_id: account_transactions.id,
        type: data.transaction_type,
        file_name: Buffer.from(file.originalname, "latin1").toString("utf8"),
        extension: file.mimetype,
        size: file.size,
        file_path: file.path,
      }));
      await prisma.uploads.createMany({ data: fileData });
    }
    res.status(200).json(account_transactions);
  } catch (error) {
    console.log("Error AccountTransaction: ", error);
    res.status(500).json({ error: "An error occurred while creating the account_transactions." });
  }
});

// Update a account_transactions
router.post("/:id", uploadMiddleware({}), async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const file_uploads = await prisma.uploads.findMany({ where: { account_transaction_id: parseInt(id) } });
    file_uploads.forEach(async (element) => {
      const projectRoot = path.resolve(__dirname, "..");
      fs.unlink(path.join(projectRoot, element.file_path), async (err) => {
        err ? console.log(err) : "";
      });
      await prisma.uploads.delete({ where: { id: parseInt(element.id) } });
    });

    const updated_account_transactions = await prisma.account_transactions.update({
      where: { id: parseInt(id) },
      data: {
        account_id: parseInt(data.account_id),
        ...(data.booking_id && { booking_id: parseInt(data.booking_id) }),
        ...(data.car_id && { car_id: parseInt(data.car_id) }),
        transaction_type: data.transaction_type,
        transaction_date: new Date(data.transaction_date).toISOString(),
        transaction_amount: parseInt(data.transaction_amount),
        transaction_note: data.transaction_note ?? null,
      },
    });
    if (req.files.length) {
      const fileData = req.files.map((file, index) => ({
        account_transaction_id: parseInt(id),
        type: data.transaction_type,
        file_name: Buffer.from(file.originalname, "latin1").toString("utf8"),
        extension: file.mimetype,
        size: file.size,
        file_path: file.path,
      }));
      await prisma.uploads.createMany({ data: fileData });
    }
    res.json(updated_account_transactions);
  } catch (error) {
    console.log("Error AccountTransaction: ", error);
    res.status(500).json({ error: "An error occurred while updating the account_transactions." });
  }
});

// Delete a account_transactions
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const file_uploads = await prisma.uploads.findMany({ where: { account_transaction_id: parseInt(id) } });
    file_uploads.forEach(async (element) => {
      const projectRoot = path.resolve(__dirname, "..");
      fs.unlink(path.join(projectRoot, element.file_path), async (err) => {
        err ? console.log(err) : "";
      });
      await prisma.uploads.delete({ where: { id: parseInt(element.id) } });
    });
    await prisma.account_transactions.delete({ where: { id: Number(id) } });
    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while deleting the account_transactions." });
  }
});

module.exports = router;
