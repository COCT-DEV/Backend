import { Router } from "express"
import {LoginUser, RefreshToken, RegisterUser } from "../controllers/authControllers"
import { authenticateToken } from "../middlewares/useAuth";

const authRouter = Router()


authRouter.post("/create", RegisterUser);
authRouter.post("/login", LoginUser);
authRouter.post("/refresh", RefreshToken);

export default authRouter;