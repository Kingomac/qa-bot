import { Document, model, Schema } from "mongoose";

export interface IRandom extends Document {
  message: string;
}

const RandomSchema = new Schema({
  message: { type: String, required: true },
});

export const Random = model("Random", RandomSchema);
