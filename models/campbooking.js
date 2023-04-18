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
},{
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
});

//Reverse populate with virtuals
CampbookingSchema.virtual('appointments', {
    ref : 'Appointment',
    localField : '_id',
    foreignField : 'campbooking',
    justOne : false
});

CampbookingSchema.virtual('buses', {
    ref : 'Bus',
    localField : '_id',
    foreignField : 'campbooking',
    justOne : false
});

//Cascade del
CampbookingSchema.pre('remove', async function(next){
    console.log(`Appointments being removed from campbooking ${this._id}`);
    await this.model('Appointment').deleteMany({campbooking:this._id});
    next();
});

CampbookingSchema.pre('remove', async function(next){
    console.log(`Buses being removed from campbooking ${this._id}`);
    await this.model('Bus').deleteMany({campbooking:this._id});
    next();
});

module.exports = mongoose.model('Campbooking', CampbookingSchema);