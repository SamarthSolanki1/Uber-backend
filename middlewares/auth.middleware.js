import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import captainSchema from "../models/captain.model.js";
import BlacklistToken from "../models/blacklistToken.model.js";


async function authUser (req,res,next){
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    if(!token){
        return res.status(401).json({message: "Unauthorized"})

    }
    const isBlacklisted = await BlacklistToken.findOne({token: token})
    if(isBlacklisted){
        res.status(401).json({message:"Unauthorized"});
    }
    try{
      const decoded = jwt.verify(token,process.env.JWT_SECRET);
      const user = await userModel.findById(decoded._id);
      req.user = user;
      return next();
    }catch{
        return res.status(401).json({message: "Unauthorized"})

    }
}
async function authCaptain(req,res,next){
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    if(!token){
        return res.status(401).json({message: "Unauthorized"})

    }
    const isBlacklisted = await BlacklistToken.findOne({token: token})
    if(isBlacklisted){
        res.status(401).json({message:"Unauthorized"});
    }
    try{
      const decoded = jwt.verify(token,process.env.JWT_SECRET);
      const captain = await captainSchema.findById(decoded._id);
      req.captain = captain;
      return next();
    }catch{
        return res.status(401).json({message: "Unauthorized"})

    }
}
export {authUser,authCaptain};