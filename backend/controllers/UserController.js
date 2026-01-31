import User from "../models/UserModel.js"
import generateToken from "../utils/jwt/user/generateToken.js";
import bcrypt from 'bcrypt'
import Course from "../models/CourseModel.js";

const  matchPassword = async function (enteredPassword,userPassword) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

const userLogin = async(req,res)=>{


    try{
        // console.log(req.body,'bodyyy')
        const {email,password} = req.body
        if(!email || !password){
            return res.status(400).json({message:'Credententials are missign'})
        }
        const user = await User.findOne({email:email})
        if(user){
            const result = await matchPassword(password,user.password)

            if(result){
                const token = generateToken(res,user._id)
              // console.log(token,'token from login')

                return res.status(200).json({user:user,success:true, token
                })
            }else{
                return res.status(401).json({message:"Password Mismatch"})
            }

        }else{
            return res.status(404).json({message:'User not Found'})
        }
       
    } catch(err){
        console.log(err)
        return res.status(500).json({err:"Internal Server Error"})
    }
}

const userRegister = async(req,res)=>{
    try{
        const {email,password,name} = req.body
        console.log(req.body,'boduuu')
       const existingUser = await User.findOne({email}) 
       if(existingUser){
        return res.status(409).json({message:'User already Exit'})
       }
       const createUser = await User.insertOne({email:email,password:password,name:name})
       if(createUser){
        console.log('user Created')
        return res.status(201).json({message:"New User Created Succesfully"})
       }else{
        return res.status(400).json({message:'User is not created something went wrong '})
       }
    }catch(err){
        console.log(err)
        return res.status(500).json({message:'Internal Server Occured'})
    }
}

 const createCourse = async (req, res) => {
  try {
    const { name, shortName, fees, duration } = req.body;

    // Basic validation
    if (!name || !fees || !duration) {
      return res.status(400).json({
        success: false,
        message: "Name, fees, and duration are required",
      });
    }

    // Optional: prevent duplicate course name
    const existingCourse = await Course.findOne({ name });
    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message: "Course already exists",
      });
    }

    const course = await Course.create({
      name,
      shortName,
      fees,
      duration,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error while creating course",
      error: err.message,
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    // const { courseId } = req.params;
    const { name, shortName, fees, duration, isActive,id } = req.body;

    // Check course exists
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Prevent duplicate name (ignore current course)
    if (name) {
      const existingCourse = await Course.findOne({
        name,
        _id: { $ne: id },
      });

      if (existingCourse) {
        return res.status(409).json({
          success: false,
          message: "Another course with this name already exists",
        });
      }
    }

    // Update only provided fields
    if (name !== undefined) course.name = name;
    if (shortName !== undefined) course.shortName = shortName;
    if (fees !== undefined) course.fees = fees;
    if (duration !== undefined) course.duration = duration;
    if (isActive !== undefined) course.isActive = isActive;

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error while updating course",
      error: err.message,
    });
  }
};

const listCourse = async(req,res)=>{
    try{
        const courses = await Course.find({})
        if(courses){
           return res.status(200).json(courses)
        }
        return res.status(404).json({message:'No courses found'})
    }catch(err){
        console.log(err)
    }
}


export {userLogin,userRegister,createCourse,updateCourse,listCourse}