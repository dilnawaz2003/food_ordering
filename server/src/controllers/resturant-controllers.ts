import { Request, Response } from "express";
import resturantModel from "../models/resturant-model";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import orderModel from "../models/order-model";
import { getPositionOfLineAndCharacter } from "typescript";

const createResturant = async (req: Request, res: Response) => {
  try {
    console.log("called");
    // const data = req.body;
    const userId = req.userId;

    let {
      resturantName,
      city,
      country,
      deliveryPrice,
      estimatedDeliveryTime,
      cuisines,
      menuItems,
    } = req.body;

    deliveryPrice = Number(deliveryPrice);
    estimatedDeliveryTime = Number(estimatedDeliveryTime);
    cuisines = JSON.parse(cuisines);
    menuItems = JSON.parse(menuItems);

    const existingResturant = await resturantModel.findOne({ userId });

    if (existingResturant) {
      console.log(existingResturant);
      res.status(401).send("resturant alreay exist");
    }

    console.log(
      resturantName,
      city,
      country,
      deliveryPrice,
      estimatedDeliveryTime,
      cuisines,
      menuItems
    );

    const newResturant = new resturantModel({
      resturantName,
      city,
      country,
      deliveryPrice,
      estimatedDeliveryTime,
      cuisines,
      menuItems,
    });
    newResturant.userId = new mongoose.Types.ObjectId(userId);
    newResturant.lastUpdated = new Date();

    const b64 = Buffer.from(req!.file!.buffer).toString("base64");
    let dataURI = "data:" + req!.file!.mimetype + ";base64," + b64;

    const cldRes = await cloudinary.uploader.upload(dataURI, {
      resource_type: "auto",
    });

    newResturant.imageUrl = cldRes.url;

    await newResturant.save();
    console.log(newResturant);

    res.json({ resturant: newResturant, message: "resturant created " });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to create resturant" });
  }
};

const getResturant = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    console.log(userId);
    const existingResturant = await resturantModel.findOne({ userId });

    if (!existingResturant) throw new Error("unable to get resturant");

    res.json({ resturant: existingResturant });
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Unable to get resturant" });
  }
};

const updateResturant = async (req: Request, res: Response) => {
  try {
    console.log("called updated resturant");
    const userId = req.userId;
    const resturant = await resturantModel.findOne({ userId });

    if (!resturant) {
      throw new Error("Resturant does not exist ");
    }

    let {
      resturantName,
      city,
      country,
      deliveryPrice,
      estimatedDeliveryTime,
      cuisines,
      menuItems,
    } = req.body;

    console.log(req.body);

    deliveryPrice = Number(deliveryPrice);
    estimatedDeliveryTime = Number(estimatedDeliveryTime);
    cuisines = JSON.parse(cuisines);
    menuItems = JSON.parse(menuItems);

    resturant.resturantName = resturantName;
    resturant.city = city;
    resturant.country = country;
    resturant.deliveryPrice = deliveryPrice;
    resturant.estimatedDeliveryTime = estimatedDeliveryTime;
    resturant.menuItems = menuItems;
    resturant.cuisines = cuisines;
    resturant.lastUpdated = new Date();

    // user may not select new image so don't update image.
    if (req.file) {
      console.log(" new file exist");
      const b64 = Buffer.from(req!.file!.buffer).toString("base64");
      let dataURI = "data:" + req!.file!.mimetype + ";base64," + b64;

      const cldRes = await cloudinary.uploader.upload(dataURI, {
        resource_type: "auto",
      });

      resturant.imageUrl = cldRes.url;
    }

    await resturant.save();

    res.json(resturant);
  } catch (error) {
    res.status(500).json({ message: "Unbale to update resturant" });
  }
};

const getRestaurantOrders = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const restaurant = await resturantModel.findOne({ userId });

    if (!restaurant)
      return res.json("Restaurant not found unable to get restaurant orders");

    const orders = await orderModel
      .find({ restaurant: restaurant._id })
      .populate("user")
      .populate("restaurant");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Unable to get restaurant orders" });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const orderId = req.params.orderId;
    const userId = req.userId;
    const { status } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ message: "Unable to update order status . Order not found" });
    }

    const restaurant = await resturantModel.findById(order.restaurant);

    if (!restaurant) {
      return res.status(404).json({
        message: "Unable to update order status . Restaurant not found",
      });
    }

    if (restaurant.userId.toString() !== userId?.toString()) {
      return res
        .status(500)
        .json({ message: "Unable to update order status.Unaouthorized" });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unable to update order status" });
  }
};

export default {
  updateResturant,
  getResturant,
  createResturant,
  getRestaurantOrders,
  updateOrderStatus,
};
