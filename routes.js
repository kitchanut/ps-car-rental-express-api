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
router.use("/login", authController);

// Authenticated routes
// router.use("/branches", authMiddleware, branches);
router.use("/branches", authMiddleware, branches);
router.use("/car_brands", authMiddleware, carBrands);
router.use("/car_models", authMiddleware, carModels);
router.use("/car_types", authMiddleware, carTypes);
router.use("/users", authMiddleware, users);

module.exports = router;
