import { Student } from "../models/StudentModel.js";
import {generateStudentToken} from "../utils/jwt/user/generateToken.js";

export const studentLogin = async (req, res) => {
  try {

    console.log(req.body,'body')
    const { email, password } = req.body; // password is expected to be the student's ID

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password (ID)" });
    }

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Check if the provided password matches the student's ID

    console.log(student.admissionNo.toString(),password,'password')
    if (student.admissionNo.toString() !== password) {
      console.log('Invalid credentials')
      return res.status(401).json({ success: false,studentSession:false, message: "Invalid credentials" });
    }

    const token = generateStudentToken(res,student._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      studentToken:stoken,
      student,
    });
  } catch (error) {
    console.error("Student login error:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

export const createStudent = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      district,

      email,
      phone,
      pincode,
      address,
      city,
      state,

      lastInstitution,
      yearOfPassout,
      institutionAddress,
      highestQualification,

      guardianName,
      guardianAddress,
      guardianMobile,

      joiningYear,
      department,
      course,
      year,
      status,

      courseFeesOriginal,
      discount,
    } = req.body;

    console.log(req.body,'bodyy')

    // ✅ Step 1: Find the last student of the same joining year
    const lastStudent = await Student.findOne({ joiningYear })
      .sort({ admissionNo: -1 })
      .lean();

    let newAdmissionNo;

    if (!lastStudent) {
      // First student of that year → start from 001
      newAdmissionNo = `ADM${joiningYear}001`;
    } else {
      // Extract last 3 digits and increment
      const lastNo = parseInt(lastStudent.admissionNo.slice(-3)); // e.g. 001 → 1
      const nextNo = (lastNo + 1).toString().padStart(3, "0"); // e.g. 002
      newAdmissionNo = `ADM${joiningYear}${nextNo}`;
    }

    
    const newStudent = await Student.create({
      firstName,
      lastName,
      gender,
      dateOfBirth,
      district,
      email,
      phone,
      pincode,
      address,
      city,
      state,
      lastInstitution,
      yearOfPassout,
      institutionAddress,
      highestQualification,
      guardianName,
      guardianAddress,
      guardianMobile,
      admissionNo: newAdmissionNo,
      joiningYear,
      department,
      course,
      year,
      status,
      courseFeesOriginal,
      discount,
    });

    
    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student: newStudent,
    });
  } catch (err) {
    console.error("Error creating student:", err);
    res.status(500).json({
      success: false,
      message: "Server Error while creating student",
      error: err.message,
    });
  }
};

export const listStudents = async(req,res)=>{
    try{
        const students = await Student.find({})
        return res.status(200).json({ success: true, students });

    }catch(err){
        console.log(err)
        res.status(500).json({
      success: false,
      message: "Server Error while creating student",
      error: err.message,
    });
    }
}

export const listStudentProfile = async(req,res)=>{
    try{

      const {studentId} = req.params
      console.log(studentId,'idd')
        const studentDetails = await Student.findById({_id:studentId})
        return res.status(200).json({ success: true, studentDetails });

    }catch(err){
        console.log(err)
        res.status(500).json({
      success: false,
      message: "Server Error while fetching student details",
      error: err.message,
    });
    }
}

// Update student fees
export const updateStudentFees = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { payments } = req.body;

    if (!payments || !Array.isArray(payments)) {
        return res.status(400).json({ success: false, message: "Invalid payment data" });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { $set: { payments: payments } },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      message: "Fees updated successfully",
      student: updatedStudent,
    });
  } catch (err) {
    console.error("Error updating fees:", err);
    res.status(500).json({
      success: false,
      message: "Server Error while updating fees",
      error: err.message,
    });
  }
};

// Update student profile
export const updateStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const updateData = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(500).json({
      success: false,
      message: "Server Error while updating student",
      error: err.message,
    });
  }
};
