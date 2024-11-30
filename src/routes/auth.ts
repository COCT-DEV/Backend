import { Router } from "express"
import {DeleteUser, LoginUser, newOtp, RefreshToken, RegisterUser, UpdateUser, VerifyUser } from "../controllers/authControllers"
import { authenticateToken } from "../middlewares/useAuth";

const authRouter = Router()


authRouter.post("/create", RegisterUser);
authRouter.post("/login", LoginUser);
authRouter.post("/refresh", RefreshToken);
authRouter.post("/verify", VerifyUser);
authRouter.post("/new-otp", newOtp)
authRouter.put("/update", authenticateToken, UpdateUser);
authRouter.delete("/delete", authenticateToken, DeleteUser);

export default authRouter;