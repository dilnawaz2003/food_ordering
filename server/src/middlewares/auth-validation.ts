import { auth } from "express-oauth2-jwt-bearer";

const jwtCheck = auth({
  audience: "food-order-mern-api",
  issuerBaseURL: "https://dev-7pnwkn2cg7mzf4r2.us.auth0.com/",
  tokenSigningAlg: "RS256",
});

export default jwtCheck;
