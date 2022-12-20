import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export function validator(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    response.status(400).json(errors.array()[0]);
    return;
  }

  next();
}
