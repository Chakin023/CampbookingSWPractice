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
});

BusSchema.pre('remove', async function(next){
    console.log(`Bus being removed from campbooking ${this._id}`);
    next();
});

module.exports = mongoose.model('Bus', BusSchema);