const express = require("express");
const cors = require("cors");

// const path = require("path");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.get("/", async (req, res) => {
  res.json({
    message: "Welcome to the PS-Car-Rental REST API",
  });
});
// const crypto = require("crypto");
// app.get("/generatetoken", async (req, res) => {
//   const VERIFY_TOKEN = crypto.randomBytes(32).toString("hex");
//   console.log("Your VERIFY_TOKEN:", VERIFY_TOKEN);
// });

// app.get("/webhook", (req, res) => {
//   const mode = req.query["hub.mode"];
//   const token = req.query["hub.verify_token"];
//   const challenge = req.query["hub.challenge"];
//   const VERIFY_TOKEN = "a48a63e4b0a65d599367da05afd5ee60262f9ea87051349b230714bc73f26d5f";
//   if (mode && token === VERIFY_TOKEN) {
//     console.log("WEBHOOK_VERIFIED");
//     res.status(200).send(challenge);
//   } else {
//     res.sendStatus(403);
//   }
// });

// app.post("/webhook", (req, res) => {
//   const body = req.body;
//   if (body.object === "page") {
//     body.entry.forEach(async (entry) => {
//       const webhookEvent = entry.messaging[0];
//       console.log(webhookEvent);
//       try {
//         const facebook_messages = await prisma.facebook_messages.create({
//           data: {
//             sender_id: webhookEvent.sender.id,
//             recipient_id: webhookEvent.recipient.id,
//             message: webhookEvent.message.text,
//           },
//         });
//         res.status(200).json(facebook_messages);
//       } catch (error) {
//         res.status(500).json({ error: "An error occurred while creating the branches." });
//       }
//     });
//     res.status(200).send("EVENT_RECEIVED");
//   } else {
//     res.sendStatus(404);
//   }
// });

const routes = require("./routes");
const webhook = require("./controllers/webhookController");
app.use("/api", routes);
app.use("/webhook", webhook);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
