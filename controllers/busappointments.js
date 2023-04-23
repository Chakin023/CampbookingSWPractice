const BusAppointment = require('../models/BusAppointment');
const Bus = require('../models/Bus');

//@desc Get all appointments
//@route GET /api/v1/bus-appointments
//@access Public
exports.getBusAppointments = async (req, res, next) => {
  let query;

  // General users can only see their own appointments
  if (req.user.role !== 'admin') {
    query = BusAppointment.find({ user: req.user.id }).populate({
      path: 'bus',
      select: 'name destination license totalSeats bookedSeats'
    });
  } else {
    query = BusAppointment.find().populate({
      path: 'bus',
      select: 'name destination license totalSeats bookedSeats'
    });
  }

  try {
    const appointments = await query;

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Cannot find appointments' });
  }
};

//@desc Get single appointment
//@route GET /api/v1/busappointments/:id
//@access Public
exports.getBusAppointment = async (req, res, next) => {
  try {
    const appointment = await BusAppointment.findById(req.params.id).populate({
      path: 'bus',
      select: 'name destination license totalSeats bookedSeats'
    });

    if (!appointment) {
      return res.status(404).json({ success: false, message: `No appointment with the id of ${req.params.id}` });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.log(error.stack);
    return res.status(500).json({ success: false, message: 'Cannot find appointment' });
  }
};

//@desc Add bus appointment
//@route POST /api/v1/buses/:busId/busappointments
//@access Private
exports.addBusAppointment = async (req, res, next) => {
  try {
      req.body.bus = req.params.busId;
      const bus = await Bus.findById(req.params.busId);
      if (!bus) {
          return res.status(404).json({ success: false, message: `No bus with the id of ${req.params.busId}` });
      }

      // Add user Id to req.body
      req.body.user = req.user.id;
      // Check for existing bus appointments
      const existingAppointments = await BusAppointment.find({ user: req.user.id });
      // If the user is not an admin, they can only create 3 appointments.
      if (existingAppointments.length >= 3 && req.user.role !== 'admin') {
          return res.status(400).json({
              success: false,
              message: `The user with ID ${req.user.id} has already made 3 appointments.`,
          });
      }

      // Update booked seats in bus schema
      if (bus.bookedSeats + 1 > bus.totalSeats) {
          return res.status(400).json({
              success: false,
              message: `No available seats. Bus is already fully booked.`,
          });
      }
      bus.bookedSeats += 1;
      await bus.save();

      const busappointment = await BusAppointment.create(req.body);
      res.status(200).json({
          success: true,
          data: busappointment
      });
  } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "Cannot create bus appointment" });
  }
};

//@desc Update appointment
//@route PUT /api/v1/bus-appointments/:id
//@access Private
exports.updateBusAppointment = async (req, res, next) => {
  try {
    const busappointment = await BusAppointment.findById(req.params.id);
    if (!busappointment) {
      return res.status(404).json({ success: false, message: `No bus appointment with the id of ${req.params.id}` });
    }

    const bus = await Bus.findById(busappointment.bus);
    if (!bus) {
      return res.status(404).json({ success: false, message: `No bus with the id of ${busappointment.bus}` });
    }

    // Check if update changes the booked seats
    let bookedSeatsChange = 0;
    if (req.body.bus && req.body.bus !== busappointment.bus) {
      // user wants to change the bus
      const newBus = await Bus.findById(req.body.bus);
      if (!newBus) {
        return res.status(404).json({ success: false, message: `No bus with the id of ${req.body.bus}` });
      }

      // update booked seats in new bus
      if (newBus.bookedSeats + 1 > newBus.totalSeats) {
        return res.status(400).json({
          success: false,
          message: `No available seats in new bus. Bus is already fully booked.`,
        });
      }
      newBus.bookedSeats += 1;
      await newBus.save();

      // reduce booked seats in old bus
      bus.bookedSeats -= 1;
      await bus.save();
      bookedSeatsChange = 1;
    } else if (req.body.bookedSeats && req.body.bookedSeats !== busappointment.bookedSeats) {
      // user wants to update the booked seats
      const newBookedSeats = parseInt(req.body.bookedSeats);
      if (newBookedSeats < 0 || newBookedSeats > bus.totalSeats) {
        return res.status(400).json({
          success: false,
          message: `Invalid number of booked seats. Must be between 0 and ${bus.totalSeats}.`,
        });
      }

      // update booked seats in bus
      const bookedSeatsDiff = newBookedSeats - busappointment.bookedSeats;
      bus.bookedSeats += bookedSeatsDiff;
      await bus.save();
      bookedSeatsChange = bookedSeatsDiff;
    }

    const updatedBusAppointment = await BusAppointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (bookedSeatsChange !== 0 && updatedBusAppointment) {
      // if the booked seats have changed, update it in the bus appointment as well
      updatedBusAppointment.bookedSeats += bookedSeatsChange;
      await updatedBusAppointment.save();

      // if the bus has changed, delete the old appointment
      if (req.body.bus && req.body.bus !== busappointment.bus) {
        await BusAppointment.findByIdAndDelete(busappointment._id);
      }
    }

    res.status(200).json({
      success: true,
      data: updatedBusAppointment
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Cannot update bus appointment" });
  }
};

//@desc     Delete appointment
//@route    DELETE /api/v1/appointment/:id
//@access   Private
exports.deleteBusAppointment = async (req, res, next) => {
  try {
    const busappointment = await BusAppointment.findById(req.params.id);

    if (!busappointment) {
      return res
        .status(404)
        .json({
          success: false,
          message: `No appointment with the id of ${req.params.id}`,
        });
    }

    // Make sure user is the appointment owner
    if (busappointment.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res
        .status(401)
        .json({
          success: false,
          message: `User ${req.user.id} is not authorized to delete this appointment`,
        });
    }

    // Update bus appointment document with the released seats
    const bus = await Bus.findByIdAndUpdate(
      busappointment.bus,
      {
        $inc: { bookedSeats: -1 },
        $currentDate: { updatedAt: true }
      },
      { new: true }
    );

    // Delete the appointment
    await BusAppointment.findByIdAndRemove(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });

  } catch (err) {
    next(err);
  }
};