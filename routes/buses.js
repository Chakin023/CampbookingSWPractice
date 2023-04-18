const express = require('express');
const {getBuses, getBus, createBus, updateBus, deleteBus} = require('../controllers/buses');
const {protect, authorize} = require('../middleware/auth');
const router = express.Router();

router.route('/').get(getBuses).post(protect, authorize('admin'), createBus);
router.route('/:id').get(getBus).put(protect, authorize('admin'), updateBus).delete(protect, authorize('admin'), deleteBus);

module.exports = router;