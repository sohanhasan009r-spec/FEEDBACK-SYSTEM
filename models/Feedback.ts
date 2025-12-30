import mongoose, { Schema, models, model } from "mongoose";

const RatingSchema = new Schema(
  {
    overallSatisfaction: { type: Number, min: 0, max: 5 },
    staffInteraction: { type: Number, min: 0, max: 5 },
    waitTimes: { type: Number, min: 0, max: 5 },
    facilityCleanliness: { type: Number, min: 0, max: 5 },
    treatmentQuality: { type: Number, min: 0, max: 5 },
    communication: { type: Number, min: 0, max: 5 },
  },
  { _id: false }
);

const FeedbackSchema = new Schema(
  {
    patientName: { type: String, required: true, trim: true },
    age: { type: Number,},
    gender: { type: String, enum: ["male", "female", "other"] },
    phoneNumber: { type: String, required: true },
    department: { type: String, required: true },
    ratings: { type: RatingSchema, required: true },
    comments: { type: String, trim: true },
    language: { type: String, enum: ["en", "hi", "as"], default: "en" },
    submittedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export default models.Feedback || model("Feedback", FeedbackSchema);
