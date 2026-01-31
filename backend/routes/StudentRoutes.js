import { Router } from "express";
import { createStudent, listStudentProfile, listStudents, updateStudentFees, updateStudent } from "../controllers/StudentController.js";

const router = Router();

router.post("/create", createStudent);
router.get("/list", listStudents);
router.get("/profile/:studentId", listStudentProfile);
router.put("/fees/:studentId", updateStudentFees);
router.put("/update/:studentId", updateStudent);

export default router;
