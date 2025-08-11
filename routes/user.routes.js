import { Router } from "express";

const userRouter = Router()

userRouter.get("/")

userRouter.post("/");
userRouter.get("/:id");
userRouter.put("/:id");
userRouter.delete("/:id")


export default userRouter