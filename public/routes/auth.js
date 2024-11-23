"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authControllers_1 = require("../controllers/authControllers");
const authRouter = (0, express_1.Router)();
authRouter.post("/create", authControllers_1.RegisterUser);
authRouter.post("/login", authControllers_1.LoginUser);
authRouter.post("/refresh", authControllers_1.RefreshToken);
exports.default = authRouter;
