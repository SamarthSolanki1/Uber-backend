import { createRide,getFare } from "../services/ride.service.js";
import { validationResult } from "express-validator";

async function createride(req,res) {
    console.log("controller reached")
      console.log(req.body)
      const { pickup, destination, vehicleType } = req.body;
        try {
          const ride = await createRide({ user: req.user._id, pickup, destination, vehicleType });


         
         //   console.log(ride)
            res.status(201).json(ride);
      }catch(err){
            res.status(500).json(err)
            console.log(err)
      }
    }
    async function getfare(req,res){
        const {pickup,destination} = req.query;
        try{
          const fare = await getFare(pickup,destination)
          res.status(201).json(fare)
        }catch(err){
          res.status(500).json(err)
          console.log(err)
        }
    }
 export {createride,getfare}
