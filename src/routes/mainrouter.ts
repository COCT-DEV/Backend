import { Router } from "express";
import authRouter from "./auth";
import churchRouter from "./church";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/church", churchRouter);

export default mainRouter;