import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRETKEY_USER);
      req.userId = decoded.userId;
      req.userRole = decoded.role;
      return next();
    } catch (error) {
      console.error("Token verification failed:", error);
      return res.status(401).json({ success: false,userSession:false, message: "Unauthorized - Invalid Token" });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false,userSession:false, message: "Unauthorized - No Token Provided" });
  }
};
