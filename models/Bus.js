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
}, {
    toJSON: {virtuals:true},
    toObject:{virtuals:true}
});

BusSchema.virtual('availableSeats').get(function() {
  return this.totalSeats - this.bookedSeats;
});

BusSchema.virtual('busappointments',{
    ref:'BusAppointments',
    localField: '_id',
    foreignField: 'bus',
    justOne: false
});

//Cascade delelte Bus when a Campbooking is deleted
BusSchema.pre('remove', async function(next){
    console.log(`Bus being removed from campbooking ${this._id}`);
    await this.model('Bus').deleteMany({campbooking: this._id});
    next();
});

module.exports = mongoose.model('Bus', BusSchema);