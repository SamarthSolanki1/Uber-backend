import captainSchema from "../models/captain.model.js";
export default async function createCaptain({firstname, lastname, email, password,mobileNumber, color, plate, capacity, vehicleType}) {
    if (!firstname || !email || !password || !color || !plate || !capacity || !vehicleType) {
        throw new Error('All fields are required');
    }
    const captain = captainSchema.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password,
        mobileNumber,
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType
        }
    })

    return captain;
}