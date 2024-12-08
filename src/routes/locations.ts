import {Router} from "express";
import {ListLocation, SearchLocations} from "../controllers/locationControllers";



export const locationRouter = Router();
locationRouter.get("/", ListLocation);
locationRouter.get("/search", SearchLocations);