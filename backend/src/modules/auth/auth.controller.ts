import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser, logoutUser } from "./auth.service";
import { sendResponse } from "../../utils/api.response";

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await registerUser(req.body);
    sendResponse({ res, statusCode: 201, success: true, message: "Registration successful", data: result });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await loginUser(req.body);
    sendResponse({ res, statusCode: 200, success: true, message: "Login successful", data: result });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization!.split(" ")[1];
    await logoutUser(token);
    sendResponse({ res, statusCode: 200, success: true, message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
}
