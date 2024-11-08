import { NextFunction, Request, Response } from "express";
import { userModel } from "../models/user-model";
import TryCatch from "../utils/trycatch-wrapper";
import { create } from "domain";

const createUser = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { auth0Id, email } = req.body;
    console.log(email);

    const existingUser = await userModel.findOne({ email });

    if (existingUser) res.send();

    const newUser = await userModel.create({
      auth0Id,
      email,
    });
    res.status(201).json({ user: newUser });
  }
);

const getUserbyId = async (req: Request, res: Response) => {
  try {
    const id = req.userId;
    // console.log("getuserbyid calles");

    if (!id) throw new Error("Please Enter Valid id");

    const user = await userModel.findById(id);

    if (!user) throw new Error("Please Enter correct id");
    // console.log(user);
    res.json({ user });
  } catch (error: any) {
    res.status(404).json({ message: error?.message || "Unable to get user" });
  }
};

const updateUser = async (request: Request, response: Response) => {
  try {
    const { name, city, addressLine1, country } = request.body;
    const { id } = request.params;
    console.log(name, city, addressLine1, country);

    const existingUser = await userModel.findOne({ auth0Id: id });

    if (name && existingUser) existingUser.name = name;
    if (city && existingUser) existingUser.city = city;
    if (addressLine1 && existingUser) existingUser.addressLine1 = addressLine1;
    if (country && existingUser) existingUser.country = country;

    await existingUser?.save();

    response.json({ user: existingUser });
  } catch (error: any) {
    response
      .status(500)
      .json({ message: error?.message || "Unable to Update  user" });
  }
};

export default {
  createUser,
  getUserbyId,
  updateUser,
};
