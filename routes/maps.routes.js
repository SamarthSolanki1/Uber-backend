import express  from "express";
import {authUser} from "../middlewares/auth.middleware.js"
import {getcoordinate,getDistancetime,getSuggestion} from "../controllers/map.controller.js";
const router = express.Router();
import { query } from "express-validator";

router.get('/get-coordinates',query('address').isString().isLength({min:3}),getcoordinate)
router.get('/get-distance-time',query('origin').isString().isLength({min:3}),query('destination').isString().isLength({min:3}),getDistancetime)
router.get('/suggestions',query('input').isString().isLength({min:3}),getSuggestion)




export default router;