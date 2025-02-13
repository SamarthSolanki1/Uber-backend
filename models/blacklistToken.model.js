import mongoose from "mongoose";
const blacklistTokenschema = new mongoose.Schema({
    token:{
        type:String,
        required:true,
        unique:true
    },
    createdAt:{
        type: Date,
        default:Date.now,
        expires:86400
    }
});
const BlacklistToken = mongoose.model("Blacklisttoken",blacklistTokenschema);
export default BlacklistToken;
