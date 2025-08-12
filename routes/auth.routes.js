import { Router } from "express";
import { SignIn, SignOut, Signup } from "../controller/auth.controller.js";

const authRouter = Router();
authRouter.post("/sign-up", Signup);
authRouter.post("/sign-in", SignIn);

authRouter.get("/sign-out", SignOut);

export default authRouter;
