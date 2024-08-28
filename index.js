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
const crypto = require("crypto");
app.get("/generatetoken", async (req, res) => {
  const VERIFY_TOKEN = crypto.randomBytes(32).toString("hex");
  console.log("Your VERIFY_TOKEN:", VERIFY_TOKEN);
});

app.get("/webhook", (req, res) => {
  // รับข้อมูลจาก query string
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // ตรวจสอบ token ที่คุณตั้งไว้
  const VERIFY_TOKEN = "a48a63e4b0a65d599367da05afd5ee60262f9ea87051349b230714bc73f26d5f";

  if (mode && token === VERIFY_TOKEN) {
    // ยืนยัน Webhook และส่งกลับ challenge
    console.log("WEBHOOK_VERIFIED");
    res.status(200).send(challenge);
  } else {
    // ปฏิเสธการยืนยัน
    res.sendStatus(403);
  }
});

app.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object === "page") {
    body.entry.forEach((entry) => {
      const webhookEvent = entry.messaging[0];
      console.log(webhookEvent);
    });

    // ส่ง status 200 เพื่อยืนยันว่าได้รับข้อมูล
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // ถ้าไม่ได้รับข้อมูลที่เกี่ยวข้อง
    res.sendStatus(404);
  }
});

const routes = require("./routes");
app.use("/api", routes);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
