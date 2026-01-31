import CourseModel from "../models/CourseModel.js";

// Create a new course
export const createCourse = async (req, res) => {
  try {
    const { name, shortName, duration, fees } = req.body;

    // Basic validation
    if (!name || !duration || !fees) {
      return res.status(400).json({ success: false, message: "Please provide name, duration, and fees." });
    }

    const newCourse = await CourseModel.create({
      name,
      shortName,
      duration,
      fees,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await CourseModel.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Update course
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCourse = await CourseModel.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedCourse) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.status(200).json({ success: true, message: "Course updated", course: updatedCourse });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Delete course
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCourse = await CourseModel.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.status(200).json({ success: true, message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const { Student } = await import("../models/StudentModel.js"); 
    
    const totalStudents = await Student.countDocuments();
    const totalCourses = await CourseModel.countDocuments();
    
    // Calculate total fees and pending fees
    const students = await Student.find({}, "payments courseFeesOriginal discount");
    let totalFeesCollected = 0;
    let totalPendingFees = 0;
    
    students.forEach(student => {
       const originalFees = Number(student.courseFeesOriginal || 0);
       const discount = Number(student.discount || 0);
       const netPayable = Math.max(0, originalFees - discount);

       let paid = 0;
       if (student.payments && student.payments.length > 0) {
           student.payments.forEach(p => {
               paid += (p.amount || 0);
           });
       }
       totalFeesCollected += paid;
       totalPendingFees += Math.max(0, netPayable - paid);
    });

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalCourses,
        totalFeesCollected,
        totalPendingFees
      }
    });

  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
