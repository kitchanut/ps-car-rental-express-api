const express = require("express");
const cors = require("cors");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", async (req, res) => {
  res.json({
    message: "Welcome to the PS-Car-Rental REST API",
  });
});

// const users = require("./routes/users");
// const branches = require("./routes/branches");
// const carBrands = require("./routes/car_brands");

// app.use("/api/users", users);
// app.use("/api/branches", branches);
// app.use("/api/car_brands", carBrands);

const routes = require("./routes");
app.use("/api", routes);

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
