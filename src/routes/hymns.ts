import { Router } from "express";
import { getHymns, hymnTitles } from "../controllers/hymnControllers";

const hymnRouter = Router()

hymnRouter.get("/", hymnTitles);
hymnRouter.get("/:hymnId", getHymns)

export default hymnRouter