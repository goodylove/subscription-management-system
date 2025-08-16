import { Router } from "express";
import {
  createSubscription,
  getUserSubscriptions,
} from "../controller/subscription.controller.js";
import authorizationMiddleWare from "../middleware/auth.middleware.js";

const subscriptionRouter = Router();

subscriptionRouter.post("/", authorizationMiddleWare, createSubscription); // CREATE SUBSCRIPTION
subscriptionRouter.get("/"); //GET all subscription
subscriptionRouter.get("/:id"); //GET subscription details
subscriptionRouter.put("/:id"); //UPDATE subscription
subscriptionRouter.delete("/:id"); // DELETE subscription

subscriptionRouter.get(
  "/user/:id",
  authorizationMiddleWare,
  getUserSubscriptions
); // GET a user subscription details

subscriptionRouter.put("/:id/cancel"); //CANCEL a user subscription
subscriptionRouter.get("/upcoming-renewal");

export default subscriptionRouter;
