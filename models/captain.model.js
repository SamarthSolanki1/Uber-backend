import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const captainschema = new mongoose.Schema({
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
        type:String,
        required:true,
        unique:true,
        minlength:[5,"It length should be more than 5"]
     },
     password:{
        type: String,
        required:true,
        select:false
    }, mobileNumber:{
        type: String,
        required:true,
        unique:true
    },socketId:{
        type: String,
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'inactive'
    },
    vehicle:{
        color:{
            type:String,
            required:true,
            minlength:[3,'Color must be of Atleast three']
        },
        plate:{
            type:String,
            required:true,
            minlength:[3,'Number plate must be of 3 character Long']
        },
        capacity:{
            type:Number,
            required:true,
            minlength:[1,'Capacity  must be atleast 1']
        },
        vehicleType:{
            type:String,
            required:true,
            enum:['car','motorcycle','auto']

        }
    },
    location:{
        lat:{
            type:Number
        },
        long:{
            type:Number
        }

    }

})
captainschema.methods.generateAuthToken = function()  {
const token = jwt.sign({_id: this._id },process.env.JWT_SECRET,{expiresIn:'24h'})
return token;
}
captainschema.methods.comparePasswords = async function(password) {
    return await bcrypt.compare(password, this.password);
}
captainschema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}
const captainmodel = mongoose.model('captain',captainschema);
export default captainmodel;