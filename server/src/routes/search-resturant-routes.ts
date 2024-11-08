import express from "express";
import searchResturantsController from "../controllers/search-resturant-controller";

const app = express.Router();

app.get("/city/:city", searchResturantsController.searchResturant);
app.get("/:id", searchResturantsController.getResturantById);

export default app;
