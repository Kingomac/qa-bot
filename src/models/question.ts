import { Document, model, Schema } from 'mongoose'

export interface IQuestion extends Document { 
    question: string,
    answer: string
}

const QuestionSchema = new Schema({
    question: {type: String, required: true},
    answer: {type: String, required: true},
});

export const Question = model('Question', QuestionSchema);