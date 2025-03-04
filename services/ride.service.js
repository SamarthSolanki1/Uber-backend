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
    console.log(fare)
    const ride = Ridemodel.create({
        user,
        pickup,
        destination,
        otp: getOtp(4),
        fare: fare[vehicleType]
    })
   return ride
}
function getOtp(length) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    
    const otp = (array[0] % Math.pow(10, length)).toString().padStart(length, '0');
    return otp;
}

export {getFare,createRide,getOtp}