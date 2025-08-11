import { Router } from "express";

const subscriptionRouter = Router()


subscriptionRouter.post("/")      // CREATE SUBSCRIPTION
subscriptionRouter.get("/")       //GET all subscription
subscriptionRouter.get("/:id");   //GET subscription details
subscriptionRouter.put("/:id");   //UPDATE subscription 
subscriptionRouter.delete("/:id");  // DELETE subscription

subscriptionRouter.get("/user/:id");  // GET a user subscription details

subscriptionRouter.put("/:id/cancel");  //CANCEL a user subscription
subscriptionRouter.get("/upcoming-renewal");

export default subscriptionRouter

// db
// dbuser