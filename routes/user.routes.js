import { Router } from "express";
import { getUser, getUsers } from "../controller/user.controller.js";
import authorizationMiddleWare from "../middleware/auth.middleware.js";

const userRouter = Router();

userRouter.get("/", authorizationMiddleWare, getUsers);

userRouter.post("/");
userRouter.get("/:id", authorizationMiddleWare, getUser);
userRouter.put("/:id");
userRouter.delete("/:id");

export default userRouter;
