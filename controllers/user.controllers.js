import { User } from "../models/user.models.js";
import { Question } from "../models/questions.models.js";
import { Answer } from "../models/answer.models.js";
import { fileUpload } from "../middlewares/cloudinary.js";
import jwt from "jsonwebtoken";



const generateToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccessToken();
        return { accessToken};
    }
    catch (error) {
        throw new Error("Token generation failed");
    }
};
const userRegister = async (req, res) => {
    const { fullname, username, email, password ,role} = req.body;
    // console.log(fullname, username, email, password);
    if (!fullname || !username || !email || !password ) {
        return res.render("register", { error: "All fields are required" });
    }
    const existingUser = await User.findOne({ 
        $or: [
            { email },
            { username }
        ] 
    });
    if (existingUser) {
        return res.render("register", { error: "User already exists" });
    }
    const profilePicPath = req.file;
    // console.log(avatar);
    if (!profilePicPath) {
        const user = await User.create({ fullname, username, email, password,role});

        const isUserCreated = await User.findById(user._id).select("-password");
        if(!isUserCreated){
            return res.status(500).json({message:"User not created"})
        }
        return res.render("login", { message: "user register successfully" });
    }
    else{
        const profilepic = profilePicPath.path;

        const profilePicture = await fileUpload(profilepic);
        const user = await User.create({ fullname, username, email, password, profilePicture: profilePicture.url,role});
    
        const isUserCreated = await User.findById(user._id).select("-password");
        if(!isUserCreated){
            return res.status(500).json({message:"User not created"})
        }
        return res.render("login", { message: "user register successfully" });
    }
}   
const userLogin = async (req, res) => {
    const {login,password}=req.body
    if(!login){
        return res.render("login",{error:"Username or email is required"})
    }
    const user = await User.findOne({
        $or:[
            {email:login},{username:login}
        ]
    })
    if(!user){
        return res.render("login",{error:"User not found with this username or email"})
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if(!isPasswordCorrect){
        return res.render("login",{error:"Password is incorrect"})
    }


    const accessToken = await generateToken(user._id);
    const options = { httpOnly: true, secure: "true" };



    const data  = await User.findOne(user._id).select('-password')
    if(data){
        return res.cookie('accessToken', accessToken,options).redirect(`/user/${data._id}/${data.fullname}`)
    }
    return res.redirect('/user/login')
}
const userQuestions = async(req,res)=>{
    const {title} = req.body;
    if(!title){
        const referer = req.header('referer');
        if (referer) {
          return res.redirect(referer);
        }
    }
    const referer = req.header('referer');
    const parts = referer.split("/");
    const specificWord = parts[3];
    const decodedString = decodeURIComponent(specificWord);
    const name= req.user;
    const question = await Question.create({title,techName:decodedString,askedBy:name});
    res.redirect(referer);
}

const userAnswers = async(req,res)=>{
    const {answer,question} = req.body;
    if(!answer){
        const referer = req.header('referer');
        if (referer) {
          return res.redirect(referer);
        } 
    }
    const id= await Question.findOne( {title: req.body.question});
    const name= req.user;
    const userans= await Answer.create({answer,question:id.title,questionId:id._id,answeredBy:name});
    const referer = req.header('referer');
    res.redirect(referer);
}

const userLogout = async(req,res)=>{
    const options = { httpOnly: true, secure: "true" };
    res.clearCookie("accessToken", options).redirect('/')
}


export { userRegister, userLogin, userQuestions, userAnswers,userLogout}