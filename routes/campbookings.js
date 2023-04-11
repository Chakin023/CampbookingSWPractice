const express = require('express');
const {getCampbookings, getCampbooking, createCampbooking, updateCampbooking, deleteCampbooking} = require('../controllers/campbookings');
const router = express.Router();
const {protect, authorize} = require('../middleware/auth');

router.route('/').get(getCampbookings).post(protect, authorize('admin'), createCampbooking);
router.route('/:id').get(getCampbooking).put(protect, authorize('admin'), updateCampbooking).delete(protect, authorize('admin'), deleteCampbooking);

module.exports = router;