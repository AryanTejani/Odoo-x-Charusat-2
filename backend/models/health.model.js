import mongoose from "mongoose";

const healthSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bodyWeight: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    bmi: {
      type: Number,
      required: true,
    },
    dailyCalories: {
      type: Number,
      required: true,
    },
    dailyProtein: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Health = mongoose.model("Health", healthSchema);
