import mongoose, { Schema } from "mongoose";

const ingredientsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
});

const commentSchema = new Schema({
  user: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
});

const moreSchema = new Schema({
  prep_time: {
    type: String,
    required: true,
  },
  cook_time: {
    type: String,
    required: true,
  },
  servings: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
});
const ItemSchema = new Schema({
  menuID: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  thumbnail_image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  tags: [String],
  ingredients: {
    type: [ingredientsSchema],
    required: true,
  },
  comments: {
    type: [commentSchema],
    required: true,
  },
  more: {
    type: [moreSchema],
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  carbs: {
    type: Number,
    required: true,
  },
  protein: {
    type: Number,
    required: true,
  },
  fat: {
    type: Number,
    required: true,
  },
  youtube_link: {
    type: String,
    required: true,
  },
});

export const Item = mongoose.model('Item',ItemSchema)

