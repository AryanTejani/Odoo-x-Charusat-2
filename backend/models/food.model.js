import mongoose from "mongoose"

const foodSchema = new mongoose.Schema({
    food: { type: String, required: true },
    nutrition: {
        Calories: { type: Number, required: true },
        Carbohydrates: { type: Number, required: true },
        Cholesterol: { type: Number, required: true },
        Fat: { type: Number, required: true },
        Protein: { type: Number, required: true },
        Sugar: { type: Number, required: true },
        FoodItem: { type: String, required: true }
    },
    createdAt: { type: Date, default: Date.now } // Individual timestamp for each food item
});

const userHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    foodItems: [foodSchema],
    createdAt: { type: Date, default: Date.now }
});

export const UserHistory = mongoose.model("UserHistory", userHistorySchema);