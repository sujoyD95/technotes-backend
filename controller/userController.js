//external imports
const asyncHandler=require('express-async-handler')
const bcrypt=require('bcrypt')


//internal imports
const User=require('../models/user')
const Note=require('../models/note')



//get all users , private access

const getAllUsers=asyncHandler(async(req,res)=>{
    const users=await User.find().select('-password').lean()


    if(!users?.length){
        return res.status(400).json({error:{user:{msg:'No User Found'}}})
    }
    else{
        return res.json(users)
    }

})

//create new user , private access

const createUser=asyncHandler(async(req,res)=>{
    const {username,password,roles}=req.body

    //confirming data

    if(!username || !password || !Array.isArray(roles) || !roles.length){
       return  res.status(400).json({error:{user:{msg:'All Fields are required'}}})
    }

    //check for duplicate
    const duplicate=await User.findOne({username}).lean().exec()

    if(duplicate){
        return res.status(409).json({error:{user:{msg:'duplicate username'}}})
    }

    //hash password

    const hashedPassword=await bcrypt.hash(password,10)

    const userObject={username,'password':hashedPassword,roles}


    const user=await User.create(userObject)


    if(user){
        return res.status(201).json({message:'User Created Successfully'})
    }
    else{
        return res.status(400).json({error:{user:{msg:'user creation failed'}}})
    }

})


//update  user , private access

const updateUser=asyncHandler(async(req,res)=>{

    const {id,username,roles,active,password}=req.body

    if(!id || !username || !Array.isArray(roles) || !roles.length || typeof active !=='boolean'){
        return  res.status(400).json({error:{user:{msg:'all fields are required'}}})

    }

    const user=await User.findById(id).exec()

    if(!user){
        return res.status(400).json({error:{user:{msg:'user not found'}}})
    }

    //check for duplicate

    const duplicate =await User.findOne({username}).lean().exec()

    if(duplicate && duplicate?._id.toString() !==id){
        return res.status(409).json({error:{user:{msg:'duplicate user: can not update'}}})

    }

    user.username=username
    user.roles=roles
    user.active=active

    if(password){
        user.password=await bcrypt.hash(password,10)

    }

    const updateUser=await user.save()

    return res.json({message:`${updateUser.username} updated`})

})

//delete user user , private access

const deleteUser=asyncHandler(async(req,res)=>{

    const {id}=req.body
    if(!id){
        return res.status(400).json({error:{user:{msg:'user id required'}}})
    }

    const notes=await Note.findOne({user:id}).lean().exec()

    if(notes?.length){
        return res.status(400).json({error:{user:{msg:'user has notes assigned'}}})
    }

    const user=await User.findById(id).exec()

    if(!user){
        return res.status(400).json({error:{user:{msg:'user not found'}}})
    }
    const result=await user.deleteOne()
    
    const reply=`username ${result.username}  deleted`

    res.json(reply)

})

module.exports={getAllUsers,createUser,updateUser,deleteUser}

