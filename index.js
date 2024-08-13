const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

app.get("/", async (req, res) => {
  res.json({
    message: "Welcome to the Prisma Client REST API",
  });
});

// const users = require("./routes/users");
const branches = require("./routes/branches");
// app.use("/api/users", users);
app.use("/api/branches", branches);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
