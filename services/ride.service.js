import Ridemodel from "../models/ride.model.js"
import { getDistanceTime } from "./maps.service.js";
async function getFare(pickup, destination) {

    if (!pickup || !destination) {
        throw new Error('Pickup and destination are required');
    }

    const distanceTime = await getDistanceTime(pickup, destination);

    const baseFare = {
        auto: 30,
        car: 50,
        moto: 20
    };

    const perKmRate = {
        auto: 10,
        car: 15,
        moto: 8
    };

    const perMinuteRate = {
        auto: 2,
        car: 3,
        moto: 1.5
    };



    const fare = {
        auto: Math.round(baseFare.auto + ((distanceTime.distance.value / 1000) * perKmRate.auto) + ((distanceTime.duration.value / 60) * perMinuteRate.auto)),
        car: Math.round(baseFare.car + ((distanceTime.distance.value / 1000) * perKmRate.car) + ((distanceTime.duration.value / 60) * perMinuteRate.car)),
        moto: Math.round(baseFare.moto + ((distanceTime.distance.value / 1000) * perKmRate.moto) + ((distanceTime.duration.value / 60) * perMinuteRate.moto))
    };

    return fare;


}
async function createRide({ user, pickup, destination, vehicleType }) {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error("All fields are required");
    }
    const fare = await getFare(pickup,destination)
    const ride = Ridemodel.create({
        user,
        pickup,
        destination,
        otp: getOtp(4),
        fare: fare[vehicleType]
    })
   return ride
}
async function confirmRide({
    rideId, captain
}){
    if (!rideId) {
        throw new Error('Ride id is required');
    }
    await Ridemodel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        captain: captain._id
    })
    const ride = await Ridemodel.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;


}
async function startride({ rideId, otp, captain }) {
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }

    // ✅ Fetch ride and ensure `socketId` is included
    let ride = await Ridemodel.findOne({ _id: rideId })
        .populate({ path: 'user', select: 'fullname email mobileNumber socketId' })
        .populate('captain')
        .select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    // 🔍 Debugging Logs
    console.log("🔍 Ride Found:", ride);
    console.log("🔍 Ride Status:", ride.status);
    console.log("🔍 Ride OTP:", ride.otp);
    console.log("🔍 Provided OTP:", otp);
    ride.status = 'accepted';

    // ✅ Ensure ride is accepted before starting
    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }

    // ✅ Validate OTP before updating status
    if (ride.otp.toString() !== otp.toString()) {
        throw new Error('Invalid OTP');
    }

    // ✅ Update ride status to "ongoing" and fetch updated ride
    const updatedRide = await Ridemodel.findOneAndUpdate(
        { _id: rideId },
        { status: 'ongoing' },
        { new: true } // ✅ Ensures we get the latest ride details
    ).populate({ path: 'user', select: 'fullname email mobileNumber socketId' });

    // 🚀 Debugging Logs After Update
    console.log("🚀 Updated Ride Object:", updatedRide);
    console.log("✅ Updated User Socket ID:", updatedRide.user?.socketId);

    return updatedRide;
}
async function endride({ rideId, captain }) {
    if (!rideId) {
        throw new Error('Ride id is required');
    }
    const ride = await Ridemodel.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');
    if (!ride) {
        throw new Error('Ride not found');
    }

   

    await Ridemodel.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    })

    return ride;
}


function getOtp(length) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    
    const otp = (array[0] % Math.pow(10, length)).toString().padStart(length, '0');
    return otp;
}

export {getFare,createRide,getOtp,confirmRide,startride,endride}