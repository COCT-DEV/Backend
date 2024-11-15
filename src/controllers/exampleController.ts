import { Request, Response } from "express"

export const exampleController = async(req: Request, res: Response): Promise<any> => {
    return res.status(200).json({
        status: "success",
        message: "This is an example route"
    })
}
