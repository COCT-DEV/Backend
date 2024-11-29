import { Router } from "express";
import { listEvents } from "../controllers/eventControllers";

const eventRouter = Router();

eventRouter.use("/", listEvents)

export default eventRouter