import { Router } from "express"
import {RegisterUser } from "../controllers/auth"

const router = Router()

router.post("/auth", RegisterUser)

export default router