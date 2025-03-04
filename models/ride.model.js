import mongoose from "mongoose";
const rideScheema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    captain:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Captain'
    },
    pickup:{
        type:String,
        required:true
    },
    destination:{
        type:String,
        required:true
    },
    fare:{
        type:Number,
        required:true
    },
    Status:{
        type:String,
        enum: ['pending','compeleted','ongoing','accepted','camcelled'],
        default: 'pending',

    },
    duration:{
        type:Number,
    },
    distance:{
        type:Number
    },
    paymentID: {
        type: String,
    },
    orderId: {
        type: String,
    },
    signature: {
        type: String,
    },
    otp:{
        type: String,
        select: false,
        required:true
    }
})
const Ridemodel = mongoose.model('ride',rideScheema)
export default Ridemodel