import {mongoose, Schema,model} from "mongoose"
import bcrypt from "bcrypt"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
dotenv.config({
    path:"./.env"
})

const userSchema = new Schema({
    fullname:{
        type:String,
        required:true,
        trim:true,
        maxLength:25
    },
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        index:true
    },
    password:{
        type:String,
        required:true,
    },
    profilePicture:{
        type:String,
        default:"https://images.rawpixel.com/image_png_400/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvdjkzNy1hZXctMTM5LnBuZw.png"
    },
    role:{
        type:String,
        default:"user",
    },
},{timestamps:true})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
    next();
});

userSchema.methods.isPasswordCorrect =async function(password){
    return await bcrypt.compare(password,this.password);
};

userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            fullname:this.fullname,
            email:this.email,
            username:this.username
        },
        process.env.ACCESS_TOKEN,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


export const User = model("User",userSchema)