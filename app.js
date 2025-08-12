import express from "express";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import connectToDataBase from "./database/mongodb.js";
import { PORT } from "./config/env.js";
import errorMiddleware from "./middleware/error.middleware.js";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/users", subscriptionRouter);

app.use(errorMiddleware);

app.listen(PORT, async () => {
  await connectToDataBase();
  console.log(`Subscription tracker is running on http://localhost:${PORT}`);
});

export default app;
