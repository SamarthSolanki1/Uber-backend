import express from "express";
import { check, validationResult } from "express-validator";
import { createride,getfare,Confirmride,startRide,endRide } from "../controllers/rides.controller.js";
import { authUser,authCaptain } from "../middlewares/auth.middleware.js"
import {body,query} from "express-validator"

const router = express.Router();

router.post(
    '/create',
    authUser,
    [
        check('pickup').isString().isLength({ min: 3 }).withMessage('Invalid PickUp'),
        check('destination').isString().withMessage('Invalid destination'),
        check('vehicleType').isString().isIn(['auto', 'car', 'moto']).withMessage('Invalid vehicle')
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); // Pass request to createride
    },
    createride
);
router.get(
    '/get-fare',
    authUser,
    [
        check('pickup').isString().isLength({ min: 3 }).withMessage('Invalid PickUp').bail().trim(),
        check('destination').isString().withMessage('Invalid destination').bail().trim()
    ],
    (req, res, next) => {
       // console.log("Request Query:", req.query); // Debugging line
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); // Pass request to getfare
    },
    getfare
);
router.post('/confirm',
    authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    Confirmride
   
)
router.get('/start-ride',
  authCaptain,
  query('rideId').isMongoId().withMessage('Invalid ride id'),
  query('otp').isString().isLength({ min: 4, max: 4 }).withMessage('Invalid otp'),
  startRide
);
router.post('/end-ride', 
   authCaptain,
   body('rideId').isMongoId().withMessage('Invalid ride id'), // ✅ Change `query` to `body`
   endRide
);



export default router;
