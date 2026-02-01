import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const generateUserToken = (res, userId) => {
  const token = jwt.sign({ userId, role: "user" }, process.env.JWT_SECRETKEY_USER, {
    expiresIn: "40d",
  });

  return token;
};
const generateStudentToken = (res, userId) => {
  const token = jwt.sign({ userId, role: "student" }, process.env.JWT_SECRETKEY_USER, {
    expiresIn: "40d",
  });

  return token;
};

export {generateUserToken,generateStudentToken}