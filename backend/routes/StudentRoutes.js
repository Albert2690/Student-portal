import { Router } from "express";
import { createStudent, listStudentProfile, listStudents, updateStudentFees, updateStudent, studentLogin } from "../controllers/StudentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

// Public Routes
router.post("/login", studentLogin);

// Protected Routes
// router.use(verifyToken);
router.post("/create", createStudent);
router.get("/list", listStudents);
router.get("/profile/:studentId", listStudentProfile);
router.put("/fees/:studentId", updateStudentFees);
router.put("/update/:studentId", updateStudent);

export default router;
