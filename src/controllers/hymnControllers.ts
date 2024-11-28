import { Request, Response } from "express"
import { listTitle } from "../services/hymnServices"

export const hymnTitles = async (req:Request, res:Response) => {
    const titles = await listTitle();
    return res.json({
        titles: titles
    })
}