import {Schema, model} from 'mongoose';

const technologySchema = new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        maxLength:25
    },
    description:{
        type:String,
        required:true,
        trim:true,
    },
    founder:{
        type:String,
        trim:true,
    },
    image:{
        type:String,
    }
},{timestamps:true})

export const Technology = model("Technology",technologySchema)

