import express from 'express';
import dotenv from "dotenv"
import router from './router/user.router.js';
import cors from "cors";
import dbConnect from './db/db.connect.js';
import { Technology } from './models/techonology.models.js';
import { Question } from './models/questions.models.js';
import { Answer } from './models/answer.models.js';
import path from 'path';
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { User } from './models/user.models.js';
import { log } from 'console';
import { verifyToken } from './middlewares/auth.js';


const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
    path:"./.env"
})
const app = express();
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({limit:"50kb"}))
app.use(express.urlencoded({extended:true},{limit:"50kb"}))
app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'));


dbConnect().then(()=>{
    app.get('/',async(req,res)=>{
        const tech = await Technology.find();
        res.render('home',{tech, user: req.user});
    })

    app.use('/user',router);

    app.get('/:name',async (req,res)=>{
        const name = req.params.name;
        const tech = await Technology.findOne({name:name});
        const question = await Question.find({techName:name}).populate('askedBy');
        const qid = await Question.find(question._id);
        const answer = await Answer.find({questionId:qid}).populate('answeredBy');
        res.render('techonology',{tech,question,answer,user: req.user});
    })
    app.get('/user/:id/:name',verifyToken,async(req,res)=>{
        const tech = await Technology.find();
        res.render('home',{tech,user: req.user});
    })

    app.listen(process.env.PORT,()=>{
        console.log("App is running");
    })
}).catch((err)=>{console.log(err)})


