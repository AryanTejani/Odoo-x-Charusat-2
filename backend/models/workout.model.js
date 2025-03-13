import mongoose from "mongoose";

const WorkoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    workoutName: {
      type: String,
      required: true,
      // Remove the unique constraint here
    },
    sets: {
      type: Number,
    },
    reps: {
      type: Number,
    },
    weight: {
      type: Number,
    },
    duration: {
      type: Number,
    },
    caloriesBurned: {
      type: Number,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create a compound index to enforce uniqueness per user per day per workout name
WorkoutSchema.index(
  { 
    user: 1, 
    workoutName: 1,
    date: 1 
  },
  { 
    unique: true,
    // This transforms the date field to truncate the time part for the index
    partialFilterExpression: {
      user: { $exists: true },
      workoutName: { $exists: true },
      date: { $exists: true }
    }
  }
);

export default mongoose.model("Workout", WorkoutSchema);