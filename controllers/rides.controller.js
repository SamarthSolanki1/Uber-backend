import { createRide,getFare,confirmRide,startride,endride } from "../services/ride.service.js";
import Ridemodel from "../models/ride.model.js";
import { validationResult } from "express-validator";
import { getCaptainIntheRadius,getAddressCoordinate } from "../services/maps.service.js";
import { sendMessageToSocketId } from "../socket.js";
async function createride(req,res) {
    console.log("controller reached")
      const { pickup, destination, vehicleType } = req.body;
        try {
          const ride = await createRide({ user: req.user._id, pickup, destination, vehicleType });
         //   console.log(ride)
            res.status(201).json(ride);
            const pickupcoordinates = await getAddressCoordinate(pickup)
            const  captaininradius = await getCaptainIntheRadius(pickupcoordinates.ltd,pickupcoordinates.lng,500)
            ride.otp = ""
            const ridewithuser = await Ridemodel.findOne({_id : ride._id}).populate('user')
           captaininradius.map( (captain) => {
       sendMessageToSocketId(captain.socketId,{
        event: 'new-ride',
        data: ridewithuser
       })
            })
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
    async function Confirmride(req,res){
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }
  
      const { rideId } = req.body;
      try {
        const ride = await confirmRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {

        console.log(err);
        return res.status(500).json({ message: err.message });
    } 

    }
    async function startRide(req,res){
      console.log("start ride controller reached")
      const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    try {
        const ride = await startride({ rideId, otp, captain: req.captain });
        console.log("🚀 Ride object:", ride);
       console.log("✅ User Socket ID:", ride.user.socketId);
   if (!ride.user.socketId) {
    console.error("❌ Error: Socket ID is still undefined, check if user is connected.");
     }


     const populatedRide = await ride.populate('captain'); // Ensure captain details are included

     sendMessageToSocketId(ride.user.socketId, {
         event: 'ride-started',
         data: populatedRide
     });

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    }
    async function endRide(req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          console.log("❌ Validation errors:", errors.array());
          return res.status(400).json({ errors: errors.array() });
      }
  
      const { rideId } = req.body; // ✅ Fix: Use req.body instead of req.query
  
      try {
          console.log("📌 End Ride API Hit | Ride ID:", rideId, "Captain:", req.captain);
  
          const ride = await endride({ rideId, captain: req.captain });
  
          if (!ride) {
              console.log("❌ Ride not found or couldn't be ended!");
              return res.status(404).json({ message: "Ride not found or cannot be ended" });
          }
  
          console.log("✅ Ride ended successfully:", ride);
  
          sendMessageToSocketId(ride.user.socketId, {
              event: 'ride-ended',
              data: ride
          });
  
          return res.status(200).json({ message: "Ride ended successfully", ride });
      } catch (err) {
          console.error("🔥 Error ending ride:", err);
          return res.status(500).json({ message: err.message || "Internal Server Error" });
      }
  }
 export {createride,getfare,Confirmride,startRide,endRide}
