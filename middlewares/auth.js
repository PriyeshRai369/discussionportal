import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.redirect("/user/login");
        }
        const tokenString = typeof token === 'object' ? token.accessToken : token;

        const decoded = jwt.verify(tokenString, process.env.ACCESS_TOKEN);
        const user = await User.findById(decoded._id).select("-password");
        if (!user) {
            return res.redirect("/user/login");
        }
        req.user = user;
        return next();
    } catch (error) {
        throw new Error(error.message);
    }
}
