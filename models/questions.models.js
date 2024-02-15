import { Schema,model } from "mongoose";

const questionSchema = new Schema({ 
    title: { type: String, required: true },
    techName: 
        {
            type: String,
            required: true
        },
        askedBy: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
},{timestamps:true});

export const Question = model('Question',questionSchema);