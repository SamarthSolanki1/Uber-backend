import userModel from "../models/user.model.js";
import BlacklistToken from "../models/blacklistToken.model.js";
import createuser from "../services/user.service.js";
import { validationResult } from "express-validator";

async function registerUser(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) { // Add ()
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, mobileNumber, password } = req.body;
  console.log(req.body);

  const hashPassword = await userModel.hashPassword(password);

  const user = await createuser({ // Add await
    firstname: fullname.firstname,
    lastname: fullname.lastname,
    email,
    password: hashPassword,
    mobileNumber,
  });

  if (!user) {
    return res.status(500).json({ message: "User creation failed" });
  }

  const token = user.generateAuthToken ? user.generateAuthToken() : null; // Ensure this function exists

  res.status(201).json({ token, user });
}
async function loginUser(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) { 
    return res.status(400).json({ errors: errors.array() }); 
  }

  const { email, password } = req.body;
  console.log(req.body)
  const user = await userModel.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({ message: 'Invalid Email and Password' }); 
  }

  const isMatch = await user.comparePasswords(password);

  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid password' }); 
  }

  const token = user.generateAuthToken();
  res.status(201).json({ token, user }); 
}

async function getUserProfile(req,res,next){
  res.status(200).json(req.user);
}
async function logoutUser(req, res, next) {
  try {
      let token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);

      if (!token) {
          return res.status(400).json({ message: "No token found" });
      }

      token = token.trim(); // Ensure no extra spaces

      // Check if the token is already blacklisted
      const isBlacklisted = await BlacklistToken.findOne({ token });
      if (!isBlacklisted) {
          await BlacklistToken.create({ token });
      }

      res.clearCookie("token"); // Clear token from cookies
      res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
      console.error("Logout error:", error);
      res.status(500).json({ message: "Internal server error" });
  }
}

export  {registerUser,loginUser,getUserProfile,logoutUser};