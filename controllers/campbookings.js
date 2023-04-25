const Campbooking = require('../models/campbooking');
const campCenter = require('../models/campCenter');

//@desc     GET all campbookings
//@route    GET /api/v1/campbookings
//@access   Public
exports.getCampbookings = async (req,res,next) => {
    //Copy req.ruery
    const reqQuery={...req.query};

    //Field to exclude
    const removeFields=['select', 'sort', 'page', 'limit'];

    //loop over remove field and delete from reqQuery
    removeFields.forEach(param=>delete reqQuery[param]);
    console.log(reqQuery);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`);
    
    query = Campbooking.find(JSON.parse(queryStr)).populate('appointments').populate('buses');

    //Select Fields
    if(req.query.select) {
        const fields=req.query.select.split(',').join(' ');
        query=query.select(fields);
    }

    //Sort
    if(req.query.sort){
        const sortBy=req.query.sort.split(',').join(' ');
        query=query.sort(sortBy);
    } else {
        query=query.sort('-createdAt');
    }

    //Pagination
    const page=parseInt(req.query.page,10)||1;
    const limit=parseInt(req.query.limit,10)||25;
    const startIndex=(page-1)*limit;
    const endIndex=page*limit;

    try {
        const total=await Campbooking.countDocuments();
        query=query.skip(startIndex).limit(limit);
        //Execute query
        const campbookings = await query;

        //Pagination result
        const Pagination={};

        if(endIndex<total){
            Pagination.next={
                page:page+1,
                limit
            }
        }

        if(startIndex>0){
            Pagination.prev={
                page:page-1,
                limit
            }
        }
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
exports.deleteCampbooking = async (req, res, next) => {
    try {
        const campbooking = await Campbooking.findById(req.params.id);

        if (!campbooking) {
            return res.status(404).json({ success: false, message: "Campbooking not found" });
        }

        // Remove the campbooking document and trigger the pre-hook to delete associated appointments
        await campbooking.Remove();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server error" });
    }
}; 

//@desc     GET camp centers
//@route    GET /api/v1/hospitals/campCenters/
//@access   Public
exports.getCampCenters = (req, res, next) => {
    campCenter.getAll((err, data) => {
        if(err)
            res.status(500).send({
                message:
                    err.message || "Some error occured while retrieving Camp Centers."
            });
        else res.send(data);
    });
};