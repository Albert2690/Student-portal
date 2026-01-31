import { Router } from "express";
import { createCourse, deleteCourse, getAllCourses, updateCourse, getDashboardStats } from "../controllers/AdminController.js";

const router = Router();

// Course Routes
router.post("/course", createCourse);
router.get("/course", getAllCourses);
router.put("/course/:id", updateCourse);
router.delete("/course/:id", deleteCourse);

// Dashboard Routes
router.get("/dashboard-stats", getDashboardStats);

export default router;
