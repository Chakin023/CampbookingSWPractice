const Campbooking = require('../models/Campbooking');

//@desc     GET all campbookings
//@route    GET /api/v1/campbookings
//@access   Public
exports.getCampbookings = async (req,res,next) => {
    try {
        const campbookings = await Campbooking.find();

        res.status(200).json({success:true, count:campbookings.length, data:campbookings});
    } catch(err){
        res.status(400).json({success:false});
    }
    
};

//@desc     GET single campbookings
//@route    GET /api/v1/campbookings/:id
//@access   Public
exports.getCampbooking = async (req,res,next) => {
    try{
        const campbooking = await Campbooking.findById(req.params.id);

        if(!campbooking){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true, data:campbooking});
    } catch(err){
        res.status(400).json({success:false});
    }
};

//@desc     CREATE new campbooking
//@route    POST /api/v1/campbookings
//@access   Private
exports.createCampbooking = async (req,res,next) => {
    const campbooking = await Campbooking.create(req.body);
    res.status(201).json({success:true, data:campbooking});
};

//@desc     UPDATE campbooking
//@route    PUT /api/v1/campbookings/:id
//@access   Private
exports.updateCampbooking = async (req,res,next) => {
    try{
        const campbooking = await Campbooking.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValdators:true
        });

        if(!campbooking){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true, data: campbooking});
    } catch(err){
        res.status(400).json({success:false});
    }
    
};

//@desc     DELETE campbookings
//@route    DELETE /api/v1/campbookings/:id
//@access   Private
exports.deleteCampbooking = async (req,res,next) => {
    try{
        const campbooking = await Campbooking.findByIdAndDelete(req.params.id);

        if(!campbooking){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true, data: {}});
    } catch(err) {
        res.status(400).json({success:false});
    }
    
};