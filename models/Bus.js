const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Please add bus name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    destination:{
        type: String,
        required: [true, 'Please add bus destination']
    },
    license:{
        type: String,
        required: [true, 'Please add bus license']
    },
    totalSeats:{
        type: Number,
        required: [true, 'Please add total number of seats']
    },
    bookedSeats:{
        type: Number,
        default: 0
    }
});

BusSchema.virtual('availableSeats').get(function() {
  return this.totalSeats - this.bookedSeats;
});

BusSchema.pre('remove', async function(next){
    console.log(`Bus being removed from campbooking ${this._id}`);
    next();
});

module.exports = mongoose.model('Bus', BusSchema);