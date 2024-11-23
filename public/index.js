"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const swagger_1 = __importDefault(require("./utils/swagger"));
const body_parser_1 = __importDefault(require("body-parser"));
const rateLimiter_1 = __importDefault(require("./middlewares/rateLimiter"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mainrouter_1 = __importDefault(require("./routes/mainrouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
console.log(process.env.PORT);
const port = Number(process.env.PORT) || 3000;
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "http://localhost:8081"],
    methods: "GET,PUT,PATCH,POST,DELETE",
    credentials: true
}));
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api", rateLimiter_1.default);
app.use("/api-docs", swagger_1.default.swaggerUi.serve, swagger_1.default.swaggerUi.setup(swagger_1.default.specs, { explorer: true }));
app.use("/api", mainrouter_1.default);
app.get("/", (req, res) => {
    res.send(`<a href="${req.protocol}://${req.get("host")}/api-docs">Swagger docs</a>`);
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
