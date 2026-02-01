import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; 
import userRoutes from "./routes/UserRoutes.js";
import adminRoutes from "./routes/AdminRoutes.js";
import studentRoutes from "./routes/StudentRoutes.js";
import { connecDb } from "./config/Db.js";
import { verifyToken } from "./middleware/authMiddleware.js";

const app = express();
const port = 7007;

// Connect to database
connecDb();

// Middleware
app.use(
  cors({
    origin: ['http://localhost:5173','https://quadros-student-portal.netlify.app'],
    credentials: true, // Enable credentials
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/user",verifyToken, userRoutes);
app.use("/api/admin", verifyToken, adminRoutes);
app.use("/api/student", studentRoutes);

// Start server
app.listen(port, () => {
  console.log("Server running at", port);
});
