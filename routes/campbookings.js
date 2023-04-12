const express = require('express');
const {getCampbookings, getCampbooking, createCampbooking, updateCampbooking, deleteCampbooking} = require('../controllers/campbookings');
//Include other resource routers
const appointmentRouter = require('./appointments');

const router = express.Router();

const {protect, authorize} = require('../middleware/auth');

//Re-route into other resource routers
router.use('/:campbookingId/appointment/', appointmentRouter);

router.route('/').get(getCampbookings).post(protect, authorize('admin'), createCampbooking);
router.route('/:id').get(getCampbooking).put(protect, authorize('admin'), updateCampbooking).delete(protect, authorize('admin'), deleteCampbooking);

module.exports = router;