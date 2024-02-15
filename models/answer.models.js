import { Schema , model} from "mongoose";

const answerSchema = new Schema({
    answer: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    questionId:{
        type:Schema.Types.ObjectId,
        ref:"Question"
    },
    answeredBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
}, { timestamps: true });

export const Answer = model("Answer", answerSchema);