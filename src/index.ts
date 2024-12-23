import cors from "cors";
import swagger from "./utils/swagger";
import bodyParser from "body-parser";
import limiter from "./middlewares/rateLimiter";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cookies from 'cookie-parser'
import mainRouter from "./routes/mainrouter";


dotenv.config();

const app: Express = express();
console.log(process.env.PORT)
const port: number = Number(process.env.PORT) || 3000;

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:8081"],
    methods: "GET,PUT,PATCH,POST,DELETE",
    credentials: true
}));

app.use(bodyParser.json());
app.use(express.json());
app.use(cookies());
app.use("/api", limiter);
app.use("/api-docs", swagger.swaggerUi.serve, swagger.swaggerUi.setup(swagger.specs, { explorer: true }));
app.use("/api", mainRouter);

app.get("/", (req: Request, res: Response) => {
    res.send(`<a href="${req.protocol}://${req.get("host")}/api-docs">Swagger docs</a>`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});