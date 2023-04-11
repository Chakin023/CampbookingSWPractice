const mongoose = require('mongoose');

const CampbookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add campground name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    address:{
        type: String,
        required: [true, 'Please add campground address']
    },
    district:{
        type: String,
        required: [true, 'Please add campground district']
    },
    province:{
        type: String,
        required: [true, 'Please add campground province']
    },
    postalcode:{
        type: String,
        required: [true, 'Please add campground postalcode'],
        maxlength: [5, 'Postal Code can not be more than 5 digits']
    },
    tel:{
        type: String,
        required: [true, 'Please add campground tel']
    },
    region:{
        type: String,
        required: [true, 'Please add campground region']
    }
});

module.exports = mongoose.model('Campbooking', CampbookingSchema);