const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all facebook_pages
router.get("/", async (req, res) => {
  try {
    const facebook_pages = await prisma.facebook_pages.findMany();
    res.json(facebook_pages);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching facebook_pages." });
  }
});

// Get a facebook_pages by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const facebook_pages = await prisma.facebook_pages.findUnique({ where: { id: parseInt(id) } });
    if (facebook_pages) {
      res.json(facebook_pages);
    } else {
      res.status(404).json({ error: "facebook_pages not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the facebook_pages." });
  }
});

// Create a new facebook_pages
router.post("/", async (req, res) => {
  const data = req.body;
  try {
    const find = await prisma.facebook_pages.findUnique({ where: { page_id: data.page_id } });
    if (find) {
      await prisma.facebook_pages.delete({
        where: {
          id: Number(find.id),
        },
      });
    }
    const new_facebook_pages = await prisma.facebook_pages.create({
      data: data,
    });
    res.status(201).json(new_facebook_pages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while creating the facebook_pages." });
  }
});

// Update a facebook_pages
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    const updated_facebook_pages = await prisma.facebook_pages.update({
      where: { id: parseInt(id) },
      data: data,
    });
    res.json(updated_facebook_pages);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while updating the facebook_pages." });
  }
});

// Delete a facebook_pages
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    await prisma.facebook_pages.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while deleting the facebook_pages." });
  }
});

module.exports = router;
