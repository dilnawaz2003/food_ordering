import express from "express";
import resturantController from "../controllers/resturant-controllers";
import multer from "multer";
import jwtCheck from "../middlewares/auth-validation";
import jwtParse from "../middlewares/jwt-parse";

const app = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  // limits: 5 * 1024 * 1024,
});

app.post(
  "/new",
  jwtCheck,
  jwtParse,
  upload.single("imageFile"),
  resturantController.createResturant
);

app.patch(
  "/order/:orderId/status",
  jwtCheck,
  jwtParse,
  resturantController.updateOrderStatus
);
app.get("/", jwtCheck, jwtParse, resturantController.getResturant);
app.get("/orders", jwtCheck, jwtParse, resturantController.getRestaurantOrders);

app.put(
  "/",
  jwtCheck,
  jwtParse,
  upload.single("imageFile"),
  resturantController.updateResturant
);

export default app;
