import { Router } from "express";
import authRouter from "./auth";
import churchRouter from "./church";
import { authenticateToken } from "../middlewares/useAuth";
import eventRouter from "./events";

const mainRouter = Router();

churchRouter.use(authenticateToken)

mainRouter.use("/auth", authRouter);
mainRouter.use("/church", churchRouter);
mainRouter.use('/events', eventRouter)


export default mainRouter;