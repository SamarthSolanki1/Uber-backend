import express  from "express";
const router = express.Router();
import { body } from "express-validator";
import {registerCaptain} from "../controllers/captain.controllers.js";
import { authCaptain } from "../middlewares/auth.middleware.js";
import { loginCaptain } from "../controllers/captain.controllers.js";
import { getcaptainProfile } from "../controllers/captain.controllers.js";
import { logoutCaptain } from "../controllers/captain.controllers.js";


router.post('/register',[
    body("email").isEmail().withMessage("Invalid Email"),
    body("fullname.firstname").isLength({ min: 3 }).withMessage("First name must be at least 3 characters long"),
    body("mobileNumber").isNumeric().withMessage("Invalid mobile number"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body('vehicle.color').isLength({ min: 3 }).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isLength({ min: 3 }).withMessage('Plate must be at least 3 characters long'),
    body('vehicle.capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType').isIn([ 'car', 'motorcycle', 'auto' ]).withMessage('Invalid vehicle type')
],
registerCaptain);
router.post('/login',[
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
],
loginCaptain);

router.get('/profile',authCaptain,getcaptainProfile);
router.get('/logout',authCaptain,logoutCaptain);




export default router;