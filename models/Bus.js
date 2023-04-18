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
    }
});

module.exports = mongoose.model('Bus', BusSchema);