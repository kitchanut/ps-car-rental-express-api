const express = require("express");
const router = express.Router();

//Middleware
const authMiddleware = require("./middleware/authMiddleware");

// Controllers
const authController = require("./controllers/auth");
const branches = require("./controllers/branches");
const carBrands = require("./controllers/car_brands");
const carModels = require("./controllers/car_models");
const carTypes = require("./controllers/car_types");
const users = require("./controllers/users");

// Login routes
router.post("/login", authController.login);

// Authenticated routes
// router.use("/branches", authMiddleware, branches);
router.use("/branches", branches);
router.use("/car_brands", carBrands);
router.use("/car_models", carModels);
router.use("/car_types", carTypes);
router.use("/users", users);

module.exports = router;
