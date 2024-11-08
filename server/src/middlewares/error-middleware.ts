import { ErrorRequestHandler } from "express";

const errorMiddleWare: ErrorRequestHandler = (error, req, res, next) => {
  const statusCode = error.statusCode ? error.statusCode : 500;
  const message = error.message ? error.message : "Internal Server Error";

  res.status(statusCode).json({ message });
};

export default errorMiddleWare;
