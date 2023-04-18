const Bus = require('../models/Bus');

//@desc     GET all buses
//@route    GET /api/v1/buses
//@access   Public
exports.getBuses = async (req,res,next) => {
    let query;
    //Copy req.ruery
    const reqQuery={...req.query};

    //Field to exclude
    const removeFields=['select', 'sort', 'page', 'limit'];

    //loop over remove field and delete from reqQuery
    removeFields.forEach(param=>delete reqQuery[param]);
    console.log(reqQuery);

    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`);
    
    query = Bus.find(JSON.parse(queryStr)).populate('campbooking');

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
        const total=await Bus.countDocuments();
        query=query.skip(startIndex).limit(limit);
        //Execute query
        const buses = await query;

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
        res.status(200).json({success:true, count:buses.length, data:buses});
    } catch(err){
        res.status(400).json({success:false});
    }
    
};

//@desc     GET single buses
//@route    GET /api/v1/buses/:id
//@access   Public
exports.getBus = async (req,res,next) => {
    try{
        const bus = await Bus.findById(req.params.id);

        if(!bus){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true, data:bus});
    } catch(err){
        res.status(400).json({success:false});
    }
};

//@desc     CREATE new bus
//@route    POST /api/v1/buses
//@access   Private
exports.createBus = async (req,res,next) => {
    const bus = await Bus.create(req.body);
    res.status(201).json({success:true, data:bus});
};

//@desc     UPDATE bus
//@route    PUT /api/v1/buses/:id
//@access   Private
exports.updateBus = async (req,res,next) => {
    try{
        const bus = await Bus.findByIdAndUpdate(req.params.id, req.body,{
            new: true,
            runValdators:true
        });

        if(!bus){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true, data: bus});
    } catch(err){
        res.status(400).json({success:false});
    }
};

//@desc     DELETE bus
//@route    DELETE /api/v1/buses/:id
//@access   Private
exports.deleteBus = async (req,res,next) => {
    try{
        const bus = await Bus.findById(req.params.id);

        if(!bus)
            return res.status(400).json({success:false});
    
        bus.remove();
        res.status(200).json({success:true, data: {}});
    } catch(err) {
        res.status(400).json({success:false});
    }
    
};

