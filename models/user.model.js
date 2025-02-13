import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const UserSchema = new mongoose.Schema({
    fullname:{
       firstname:{
        type: String,
        required:true,
        minlength:[3,"First name must be atleast 3 Characters"]
       },
       lastname:{
        type: String,
        minlength:[3,"Last name must be atleast 3 Characters"]
       }
    },
    email:{
      type: String,
      required:true,
      unique:true,
      minlength:[5,"email must be atleast 3 Characters"]
    },
    password:{
        type: String,
        required:true,
        select:false
    },
    socketId:{
        type: String,
    },
    mobileNumber:{
        type: String,
        required:true,
        unique:true
    }
})

UserSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}
UserSchema.methods.comparePasswords = async function(password) {
    return await bcrypt.compare(password, this.password);
}
UserSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const userModel = mongoose.model('user', UserSchema);


export default userModel;