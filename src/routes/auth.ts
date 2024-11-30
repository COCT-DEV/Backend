import { Router } from "express"
import {DeleteUser, LoginUser, newVerifyOtp, passwordUpdateOTP, RefreshToken, RegisterUser, ResetPassword, UpdateUser, VerifyUser } from "../controllers/authControllers"
import { authenticateToken } from "../middlewares/useAuth";

const authRouter = Router()


authRouter.post("/create", RegisterUser);
authRouter.post("/login", LoginUser);
authRouter.post("/refresh", RefreshToken);
authRouter.post("/verify", VerifyUser);
authRouter.post("/new-otp", newVerifyOtp)
authRouter.put("/update", authenticateToken, UpdateUser);
authRouter.delete("/delete", authenticateToken, DeleteUser);
authRouter.post("/password-otp", authenticateToken, passwordUpdateOTP);
authRouter.post("/reset-password", authenticateToken, ResetPassword);

export default authRouter;