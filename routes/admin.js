const { adminMiddleware } = require("../middleware/admin");

const {Router} = require("express");
const adminRouter = Router();
const {adminModel} = require("../db");

const {JWT_ADMIN_PASSWORD} = require("../config");
const jwt = require("jsonwebtoken");


adminRouter.post("/signup",async function(req,res){
    const{email,password,firstName,lastName} = req.body;
          
    await adminModel.create({
         email : email,
         password : password,
         firstName : firstName,
         lastName : lastName
     })
 
     res.json({
         message:"signup succeded"
     })
})

adminRouter.post("/signin",async function(req,res){
    const{ email,password } = req.body;
    const admin = await adminModel.findOne({
        email : email,
        password : password
    });
    if(admin){
      const token = jwt.sign({
        id: admin._id
       },JWT_ADMIN_PASSWORD);

       res.json({
        token : token
       })
    }else{
    res.status(403).json({
        message:"Incorrect Credentials"
    })
}
})


adminRouter.post("/course",adminMiddleware,async function(req,res){
    const adminId = req.userId

    const {title,description,imageUrl,price} = req.body;

   const course = await courseModel.create({ 
        title : title,
        description : description,
        price : price,
        imageUrl : imageUrl,
        creatorId:adminId
    })
    res.json({
        message : "course created",
        courseId : course._id
    })
})

adminRouter.put("/course",adminMiddleware,async function(req,res){
    const adminId = req.userId

    const {title,description,imageUrl,price,courseId} = req.body;
     
   const course = await courseModel.create({ 
    _id: courseId,
    creatorId: adminId,
   },{
        title : title,
        description : description,
        price : price,
        imageUrl : imageUrl,
        creatorId:adminId
    })
    res.json({
        message : "course updated",
        courseId : course._id
    })
})
adminRouter.get("/course/bulk",adminMiddleware,async function(req,res){
    const adminId = req.userId;
    const courses = await courseModel.find({ 
        
        creatorId: adminId
       },)
        res.json({
            message : "course updated",
            courses
        })
})

module.exports = {
    adminRouter:adminRouter
}