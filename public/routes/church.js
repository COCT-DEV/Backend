"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const useAuth_1 = require("../middlewares/useAuth");
const churchRouter = (0, express_1.Router)();
churchRouter.use(useAuth_1.authenticateToken);
churchRouter.get('/', (req, res) => {
    res.json({ message: "This route is protected!" });
});
exports.default = churchRouter;
