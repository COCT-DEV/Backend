import { Request, Response } from "express"
import { getHymnal, HymnServiceError, listTitles } from "../services/hymnServices"
import { hymnReqBody, hymnReqQuery } from "../types/queryBodyParams"
import { Version } from "@prisma/client"


type VersionHandler = Request<{}, {}, {}, hymnReqQuery>;


export const hymnTitles = async (req: VersionHandler, res: Response): Promise<any> => {

    try {
        const { version = "TWI" } = req.query as hymnReqQuery;

        const hymnVersion = version.toUpperCase() as Version
        const titles = await listTitles(hymnVersion);
        return res.status(200).json({
            titles: titles
        })
    } catch (err) {
        return res.status(400).json({
            error: 'Invalid version(twi or english'
        })
    }
}
export const getHymns = async (req: Request, res: Response): Promise<any> => {
    const { hymnId } = req.params as hymnReqBody;    
    try {
        const hymn = await getHymnal(hymnId);
        return res.status(200).json({
            hymn: hymn
        })
    } catch (err) {
        if (err instanceof HymnServiceError) {
            switch (err.code) {
                case "NOT_FOUND":
                    return res.status(404).json({ "error": err.message })
                default:
                    return res.status(500).json({ "error": "Internal Server Error" })
            }
        }
        else {
            console.log(err);
            return res.status(500).json({"error":"Internal Server Error"});
        }
    }
}