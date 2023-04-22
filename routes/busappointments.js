const express = require('express');

const {getBusAppointments, getBusAppointment, addBusAppointment, updateBusAppointment, deleteBusAppointment} = require('../controllers/busappointments');

const router = express.Router({mergeParams:true});

const {protect, authorize} = require('../middleware/auth');

router.route('/')
    .get(protect, getBusAppointments)
    .post(protect, authorize('admin', 'user'),addBusAppointment);
router.route('/:id')
    .get(protect, getBusAppointment)
    .put(protect, authorize('admin', 'user'), updateBusAppointment)
    .delete(protect, authorize('admin', 'user'), deleteBusAppointment);

module.exports = router;