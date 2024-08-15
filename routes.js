const express = require("express");
const router = express.Router();

//Middleware
const authMiddleware = require("./middleware/authMiddleware");

// Controllers
const authController = require("./controllers/auth");
const uploadController = require("./controllers/uploadController");
const branches = require("./controllers/branches");
const cars = require("./controllers/cars");
const carBrands = require("./controllers/car_brands");
const carModels = require("./controllers/car_models");
const carSubModels = require("./controllers/car_sub_models");
const carTypes = require("./controllers/car_types");
const users = require("./controllers/users");

// Login routes
router.use("/auth", authController);
router.use("/upload", uploadController);

// Authenticated routes
router.use("/branches", authMiddleware, branches);
router.use("/cars", authMiddleware, cars);
router.use("/car_brands", authMiddleware, carBrands);
router.use("/car_models", authMiddleware, carModels);
router.use("/car_sub_models", authMiddleware, carSubModels);
router.use("/car_types", authMiddleware, carTypes);
router.use("/users", authMiddleware, users);

module.exports = router;
