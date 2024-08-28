const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios");

const LINE_NOTIFY_TOKEN = "duFnBTlRddOVE4ywC3l7uYg6QxK8naXVg2GhAWYG0Nu";
const sendLineNotify = (message) => {
  return axios.post("https://notify-api.line.me/api/notify", `message=${encodeURIComponent(message)}`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${LINE_NOTIFY_TOKEN}`,
    },
  });
};

router.get("/", async (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  const VERIFY_TOKEN = "a48a63e4b0a65d599367da05afd5ee60262f9ea87051349b230714bc73f26d5f";

  if (mode && token === VERIFY_TOKEN) {
    console.log("WEBHOOK_VERIFIED");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

router.post("/", async (req, res) => {
  const body = req.body;
  sendLineNotify(JSON.stringify(body));
  if (body.object === "page") {
    body.entry.forEach(async (entry) => {
      const webhookEvent = entry.messaging[0];
      try {
        await prisma.facebook_messages.create({
          data: {
            sender_id: webhookEvent.sender.id,
            recipient_id: webhookEvent.recipient.id,
            message: webhookEvent.message.text,
          },
        });
      } catch (error) {
        res.status(500).json({ error: "An error occurred while creating the branches." });
      }
    });
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
