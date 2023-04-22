const mongoose = require('mongoose');

const BusAppointmentSchema = new mongoose.Schema({
  apptDate: {
    type: Date,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  bus: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bus',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BusAppointment', BusAppointmentSchema);