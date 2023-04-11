const express = require('express');
const {getCampbookings, getCampbooking, createCampbooking, updateCampbooking, deleteCampbooking} = require('../controllers/campbookings');
const router = express.Router();

router.route('/').get(getCampbookings).post(createCampbooking);
router.route('/:id').get(getCampbooking).put(updateCampbooking).delete(deleteCampbooking);

module.exports = router;