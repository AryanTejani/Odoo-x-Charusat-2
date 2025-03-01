import mongoose, { Schema } from "mongoose";

const categorySchema = Schema({
    name:String,
    menuId:Number
})

export const categorySch = mongoose.model("Category",categorySchema);