import { Router } from "express";
import { authenticateToken } from "../middlewares/useAuth";

const churchRouter = Router();

churchRouter.use(authenticateToken)


churchRouter.get('/', (req, res) => {
    res.json({ message: "This route is protected!" });
});

export default churchRouter;