import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

// ROUTES IMPORTS
import userRoutes from "./routes/user-routes";
import errorMiddleWare from "./middlewares/error-middleware";
import resturantRoutes from "./routes/resturant-routes";
import searchResturantRoutes from "./routes/search-resturant-routes";
import orderRoutes from "./routes/order-routes";

// APP
const app = express();

//CONFIGS
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(cors());
app.use("/api/order/checkout/webhook", express.raw({ type: "*/*" }));

app.use(express.json());

// ROUTES

app.use("/api/user/", userRoutes);
app.use("/api/resturant/", resturantRoutes);
app.use("/api/resturant/search/", searchResturantRoutes);
app.use("/api/order/", orderRoutes);

// ERROR MIDDLEWARE

app.use(errorMiddleWare);

// CONNECTION
const main = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_CONNECTION_URI!);
    app.listen(4000, () => {
      console.log("Server Listining on port:4000");
    });
  } catch (error) {
    console.log("ERROR CONECTING DATABASE");
    console.log(error);
  }
};

main();
