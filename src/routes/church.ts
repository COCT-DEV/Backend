import { Router } from "express";

const churchRouter = Router();




churchRouter.get('/', (req, res) => {
    res.json({ message: "This route is protected!" });
});

export default churchRouter;