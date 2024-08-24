const express = require("express");
const router = express.Router();

const uploadMiddleware = require("../middleware/uploadMiddleware");

const fs = require("fs");
const path = require("path");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all account_transactions
router.get("/", async (req, res) => {
  try {
    // get query parameters
    const { account_id, booking_id, transaction_type } = req.query;
    const account_transactions = await prisma.account_transactions.findMany({
      include: {
        upload: true,
        account: true,
        booking: true,
      },
      where: {
        ...(account_id && { account_id: parseInt(account_id) }),
        ...(booking_id && { booking_id: parseInt(booking_id) }),
        ...(transaction_type && { transaction_type: transaction_type }),
      },
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
    let uploads;
    const files = req.files;
    if (files.length > 0) {
      const fileData = {
        type: data.transaction_type,
        file_name: req.files[0].originalname,
        extension: req.files[0].mimetype,
        file_path: req.files[0].path,
      };
      uploads = await prisma.uploads.create({ data: fileData });
    }

    const account_transactions = await prisma.account_transactions.create({
      data: {
        account_id: parseInt(data.account_id),
        ...(data.booking_id && { booking_id: parseInt(data.booking_id) }),
        ...(data.car_id && { car_id: parseInt(data.car_id) }),
        transaction_type: data.transaction_type,
        transaction_date: new Date(data.transaction_date).toISOString(),
        transaction_amount: parseInt(data.transaction_amount),
        transaction_note: data.transaction_note ?? null,
        ...(req.files.length > 0 && { upload_id: parseInt(uploads.id) }),
      },
    });
    if (req.files.length > 0) {
      const updated_uploads = await prisma.uploads.update({
        where: { id: parseInt(uploads.id) },
        data: {
          ...(data.booking_id && { booking_id: parseInt(data.booking_id) }),
          ...(data.car_id && { car_id: parseInt(data.car_id) }),
        },
      });
    }

    res.status(200).json(account_transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while creating the account_transactions." });
  }
});

// Update a account_transactions
router.post("/:id", uploadMiddleware({}), async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const account_transactions = await prisma.account_transactions.findUnique({ where: { id: parseInt(id) } });
    // delete the existing file
    if (account_transactions.upload_id && req.files.length > 0) {
      const fileRecord = await prisma.uploads.findUnique({ where: { id: parseInt(account_transactions.upload_id) } });
      if (fileRecord) {
        fs.unlink(path.join(path.resolve(__dirname, ".."), fileRecord.file_path), async (err) => {
          err ? console.log(err) : "";
          await prisma.uploads.delete({ where: { id: parseInt(account_transactions.upload_id) } });
        });
      }
    }

    // create a new file
    let uploads;
    const files = req.files;
    if (files.length > 0) {
      const fileData = {
        type: data.transaction_type,
        file_name: req.files[0].originalname,
        extension: req.files[0].mimetype,
        file_path: req.files[0].path,
      };
      uploads = await prisma.uploads.create({ data: fileData });
    }

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
        ...(req.files.length > 0 && { upload_id: parseInt(uploads.id) }),
      },
    });
    if (req.files.length > 0) {
      const updated_uploads = await prisma.uploads.update({
        where: { id: parseInt(uploads.id) },
        data: {
          ...(data.booking_id && { booking_id: parseInt(data.booking_id) }),
          ...(data.car_id && { car_id: parseInt(data.car_id) }),
        },
      });
    }
    res.json(updated_account_transactions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while updating the account_transactions." });
  }
});

// Delete a account_transactions
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // get the account_transactions
    const account_transactions = await prisma.account_transactions.findUnique({ where: { id: parseInt(id) } });
    if (account_transactions.upload_id) {
      const fileRecord = await prisma.uploads.findUnique({ where: { id: parseInt(account_transactions.upload_id) } });
      // delete the image
      const projectRoot = path.resolve(__dirname, "..");
      fs.unlink(path.join(projectRoot, fileRecord.file_path), async (err) => {
        err ? console.log(err) : "";
      });
    }
    // delete the account_transactions
    if (account_transactions.upload_id) {
      await prisma.uploads.delete({ where: { id: parseInt(account_transactions.upload_id) } });
    }
    await prisma.account_transactions.delete({ where: { id: Number(id) } });
    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while deleting the account_transactions." });
  }
});

module.exports = router;
