    const {Router} = require("express");
    const {userMiddleware} = require("../middleware/user");
    const {userModel, courseModel} = require("../db");
    const {JWT_USER_PASSWORD} = require("../config");
    const jwt = require("jsonwebtoken");
   const {purchaseModel} = require("../db");
const { courseRouter } = require("./course");
    
    const userRouter = Router();
   
    userRouter.post("/signup",async function(req,res){
        const{email,password,firstName,lastName} = req.body;
          
       await userModel.create({
            email : email,
            password : password,
            firstName : firstName,
            lastName : lastName
        })
    
        res.json({
            message:"signup succeded"
        })
    })


    
    userRouter.post("/signin",async function(req,res){
        const{ email,password } = req.body;
        const user = await userModel.findOne({
            email : email,
            password : password
        });
        if(user){
          const token = jwt.sign({
            id: user._id
           },JWT_USER_PASSWORD);

           res.json({
            token : token
           })
        }else{
        res.status(403).json({
            message:"Incorrect Credentials"
        })
    }
    })
    
    userRouter.get("/purchases",userMiddleware,async function(req,res){
        const userId = req.userId;
        const courseId = req.body.courseId;
      const purchases =  await purchaseModel.find({
            userId,
        })
        res.json({
          purchases
        })
    })
courseRouter.get("/preview",userMiddleware,async function(req,res){
    
    const courses = await courseModel.find({});
    res.json({
        courses
    })
})

module.exports = {
    userRouter:userRouter
}