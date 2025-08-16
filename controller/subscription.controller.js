import { SERVER_URL } from "../config/env.js";
import workflowClient from "../config/upstach.js";
import Subscription from "../models/subscription.models.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });
    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription._id,
      },
      headers: {
        "content-type": "application/json",
      },
      retries: 0,
    });
    
    res.status(200).json({
      success: true,
      data: { subscription, workflowRunId },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      const error = new Error("You are not authorize to access  this data");
      error.statusCode = 403;
      throw error;
    }

    const subscription = await Subscription.find({ user: req.params.id });

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};
