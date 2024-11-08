import mongoose, { InferSchemaType } from "mongoose";

export type menuItemType = InferSchemaType<typeof menuItemSchema>;

const menuItemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    default: new mongoose.Types.ObjectId(),
  },
  price: { type: Number, required: true },
  name: { type: String, required: true },
});

const resturantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  resturantName: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  deliveryPrice: { type: Number, required: true },
  estimatedDeliveryTime: { type: Number, required: true },
  cuisines: [String],
  imageUrl: { type: String, required: true },
  lastUpdated: { type: Date, required: true },
  menuItems: [menuItemSchema],
});

const resturantModel = mongoose.model("Resturant", resturantSchema);
export default resturantModel;
