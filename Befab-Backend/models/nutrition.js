const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  auth: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  meals: [{ name: { type: String }, calories: { type: Number }, protein: { type: Number }, fiber: { type: Number }, carbs: { type: Number } }],
  calories: {
    range: { type: Number },
    total: { type: Number },
    burned: { type: Number },
    remaining: { type: Number },
  },
  water: { range: {type: Number},
    drink: { type: Number },
  },
  macronutrient: { fats: {type: Number},
    carbs: { type: Number },
    protein: { type: Number },
    fiber: { type: Number },
    sugar: { type: Number },
    sodium: { type: Number },
  },
  foods: [{ type: mongoose.Schema.Types.ObjectId, ref: "food" }],
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "food" }],
  sleep: { type: Number },
  createdAt: { type: Date, default: Date.now },
});
const Nutrition = mongoose.model("nutrition", UserSchema);
module.exports = Nutrition;
