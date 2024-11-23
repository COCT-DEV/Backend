import { Router } from "express"
import {LoginUser, RefreshToken, RegisterUser } from "../controllers/auth"

const router = Router()

router.post("/auth/create", RegisterUser);
router.post("/auth/login", LoginUser);
router.post("/auth/refresh", RefreshToken);
export default router