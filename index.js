const express = require("express");
const app = express();

// Middleware
app.use(express.json());

// Routes

app.get("/", async (req, res) => {
  res.json({
    message: "Welcome to the Prisma Client REST API",
  });
});

const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
