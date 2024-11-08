import express from "express";
import jwtCheck from "../middlewares/auth-validation";
import jwtParse from "../middlewares/jwt-parse";
import orderControllers from "../controllers/order-controllers";

const app = express.Router();

app.post(
  "/checkout/create-checkout-session",
  jwtCheck,
  jwtParse,
  orderControllers.createCheckOutSession
);

app.post("/checkout/webhook", orderControllers.stripeWebhookHandler);

app.get("/myorders", jwtCheck, jwtParse, orderControllers.getUserOrders);

export default app;
