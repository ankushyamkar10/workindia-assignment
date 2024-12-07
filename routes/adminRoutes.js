const express = require("express");
const adminController = require("../controllers/adminController");
const apiKeyMiddleware = require("../middlewares/apiKeyMiddleware");
const router = express.Router();

router.post("/trains", apiKeyMiddleware, adminController.addTrain);
router.patch("/trains/:train_id", apiKeyMiddleware, adminController.updateTrain);

module.exports = router;
