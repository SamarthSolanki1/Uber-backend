import express from "express";
import { body } from "express-validator";
import {registerUser,loginUser,getUserProfile,logoutUser} from "../controllers/user.controllers.js";
import {authUser} from "../middlewares/auth.middleware.js"

const router = express.Router(); // Use router instead of app

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname.firstname").isLength({ min: 3 }).withMessage("First name must be at least 3 characters long"),
    body("mobileNumber").isNumeric().withMessage("Invalid mobile number"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  ],
  registerUser
);

router.post('/login',[
  body("email").isEmail().withMessage("Invalid Email"),
  body("password").isLength({min:6}).withMessage("Password must be atleast 6 character long")
],
loginUser);

router.get('/profile',authUser,getUserProfile)

router.get('/logout',authUser,logoutUser)

export default router;