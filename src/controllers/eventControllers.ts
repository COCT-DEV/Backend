import { Request, Response } from "express";
import { getEvents } from "../services/eventServices";


export const listEvents = async (req: Request, res: Response) => {
    const events = await getEvents();
    console.log(events);
    res.status(200).json(
        {
            events
        }
    )
}