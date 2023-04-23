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

//Cascade delete appointments when a campbooking is deleted
BusSchema.pre('Remove', async function(next){
    console.log(`Bus Appointments being removed from bus ${this._id}`);
    await this.model('BusAppointment').deleteMany({bus: this._id});
    next();
});

// Add custom remove method to the schema to avoid overwriting the internal remove method
BusSchema.methods.Remove = async function() {
    await this.model('Bus').deleteOne({ _id: this._id });
  };
  


module.exports = mongoose.model('Bus', BusSchema);