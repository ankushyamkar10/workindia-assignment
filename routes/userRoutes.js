const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/trains', userController.getTrainAvailability);
router.post('/book', authMiddleware, userController.bookSeat);
router.get('/bookings/:bookingId', authMiddleware, userController.getBookingDetails);


module.exports = router;
