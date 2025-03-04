import express from "express";
import { check, validationResult } from "express-validator";
import { createride,getfare } from "../controllers/rides.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
    '/create',
    authUser,
    [
        check('pickup').isString().isLength({ min: 3 }).withMessage('Invalid PickUp'),
        check('destination').isString().withMessage('Invalid destination'),
        check('vehicleType').isString().isIn(['auto', 'car', 'motorcycle']).withMessage('Invalid vehicle')
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
        console.log("Request Query:", req.query); // Debugging line
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); // Pass request to getfare
    },
    getfare
);


export default router;
