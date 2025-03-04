import {getAddressCoordinate,getDistanceTime,getautoSuggestions} from "../services/maps.service.js";
import { validationResult } from "express-validator";



async function getcoordinate(req,res,next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) { // Add ()
        return res.status(400).json({ errors: errors.array() });
      }
const {address} = req.query;
console.log(address)
   try{
    const coordinates = await getAddressCoordinate(address)
    res.status(200).json(coordinates);
   }catch(error){
    res.status(404).json({message: error})
   }
}
async function getDistancetime(req,res,next){
    const errors = validationResult(req)
    if (!errors.isEmpty()) { // Add ()
        return res.status(400).json({ errors: errors.array() });
      }
      const {origin,destination} = req.query;
      try{
      const distanceandtime = await getDistanceTime(origin,destination)
      res.status(200).json(distanceandtime)
      }catch (error) {
        res.status(404).json({message: error})
      }

}
async function getSuggestion(req,res,next){
      try{
        const errors = validationResult(req)
        if (!errors.isEmpty()) { // Add ()
            return res.status(400).json({ errors: errors.array() });
          }
          const {input} = req.query;
          const suggestion = await getautoSuggestions(input)
          res.status(200).json(suggestion)
      }catch(err){
           res.status(404).json({message : err})
      }

}

export {getcoordinate,getDistancetime,getSuggestion}
