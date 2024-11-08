import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    unique: true,
    required: true,
    type: String,
  },
  auth0Id: {
    type: String,
    required: true,
  },
  name: String,
  city: String,
  addressLine1: String,
  country: String,
});

const userModel = mongoose.model("User", UserSchema);

export { userModel };
