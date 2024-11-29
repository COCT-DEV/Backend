import { Router } from "express"
import {DeleteUser, LoginUser, RefreshToken, RegisterUser, UpdateUser } from "../controllers/authControllers"
import { authenticateToken } from "../middlewares/useAuth";

const authRouter = Router()


authRouter.post("/create", RegisterUser);
authRouter.post("/login", LoginUser);
authRouter.post("/refresh", RefreshToken);
authRouter.put("/update", authenticateToken, UpdateUser);
authRouter.delete("/delete", authenticateToken, DeleteUser);

export default authRouter;