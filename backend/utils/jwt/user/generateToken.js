import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const generateUserToken = (res, userId) => {
  const token = jwt.sign({ userId, role: "user" }, process.env.JWT_SECRETKEY_USER, {
    expiresIn: "40d",
  });

  const cookieOptions = {
    httpOnly: false,
    secure: false, 
    sameSite: 'strict', 
    maxAge: 40 * 24 * 60 * 60 * 1000, 
    path: '/', 
  };

  // if (process.env.NODE_ENV === 'production') {
  //   cookieOptions.secure = true; // Ensure the cookie is only sent over HTTPS
  //   cookieOptions.domain = '.balady.org.in'; // Set the cookie for the entire domain
  // }

  res.cookie("userJwt", token, cookieOptions);

  console.log(token, 'token');
  return token;
};

export default generateUserToken;