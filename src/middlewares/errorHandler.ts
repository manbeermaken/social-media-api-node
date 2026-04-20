import HttpError from "../utils/httpError.js";
import type { ErrorRequestHandler } from "express";

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof HttpError) {
    const statusCode = error.statusCode;

    return res.status(statusCode).json({
      message: error.message,
      details: error.details,
    });
  }

  console.error("Unhandled Error:", error);
  return res
    .status(500)
    .json({ message: "Something went wrong" });
};

export default errorHandler;
