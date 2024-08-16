const express = require("express");
const router = express.Router();

//Middleware
const authMiddleware = require("./middleware/authMiddleware");

// Controllers
const authController = require("./controllers/authController");
const uploadController = require("./controllers/uploadController");
const branchController = require("./controllers/branchController");
const carController = require("./controllers/carController");
const carBrandController = require("./controllers/carBrandController");
const carModelController = require("./controllers/carModelController");
const carSubModelController = require("./controllers/carSubModelController");
const carTypeController = require("./controllers/carTypeController");
const userController = require("./controllers/userController");
const customerController = require("./controllers/customerController");
const bookingController = require("./controllers/bookingController");

// Login routes
router.use("/auth", authController);
router.use("/upload", uploadController);

// Authenticated routes
router.use("/branches", authMiddleware, branchController);
router.use("/cars", authMiddleware, carController);
router.use("/car_brands", authMiddleware, carBrandController);
router.use("/car_models", authMiddleware, carModelController);
router.use("/car_sub_models", authMiddleware, carSubModelController);
router.use("/car_types", authMiddleware, carTypeController);
router.use("/users", authMiddleware, userController);
router.use("/customers", authMiddleware, customerController);
router.use("/bookings", authMiddleware, bookingController);

module.exports = router;
