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

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
