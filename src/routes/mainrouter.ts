import { Router } from "express";
import authRouter from "./auth";
import churchRouter from "./church";
import { authenticateToken } from "../middlewares/useAuth";
import eventRouter from "./events";
import hymnRouter from "./hymns";

const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/church", churchRouter);
mainRouter.use('/events', eventRouter);
mainRouter.use('/hymns', hymnRouter);


export default mainRouter;