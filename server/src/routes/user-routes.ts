import express from "express";
import userControllers from "../controllers/user-controllers";
import jwtCheck from "../middlewares/auth-validation";
import jwtParse from "../middlewares/jwt-parse";

const app = express.Router();

// TODO : make this route api/user/new
app.post("/", jwtCheck, userControllers.createUser);

// get user : api/user/
app.get("/", jwtCheck, jwtParse, userControllers.getUserbyId);

app.patch("/:id", jwtCheck, userControllers.updateUser);

export default app;
