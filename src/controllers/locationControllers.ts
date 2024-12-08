import {Request, Response} from "express";
import {listLocations, searchLocation} from "../services/locationService";
import {ServiceError, ServiceErrorCode} from "../utils/errors/ServiceErrors";


export const ListLocation = async  (req: Request, res: Response): Promise<any> => {
    try {
        const locations = await listLocations();
        return res.status(200).json(
            {locations: locations}
        );
    } catch (err) {
        if (err instanceof ServiceError && err.code === ServiceErrorCode.LOCATION_NOT_FOUND) {
            return res.status(400).json({error: "Location not found"})
        } else {
            return res.status(500).json({ "error": "Internal Server Error" })
        }
    }
}

export const SearchLocations = async (req: Request, res: Response): Promise<any> => {
    const value = req.query.location as string;
    if (!value) {
        return res.status(400).json({ error: "Location is required" })
    }
    try {
        const foundLocations = await  searchLocation(value);
        console.log(foundLocations);
        return res.status(200).json({locations: foundLocations});
    } catch (error) {
        if (error instanceof ServiceError)
        {
            switch (error.code) {
                case ServiceErrorCode.LOCATION_NOT_FOUND:
                    throw new ServiceError(error.message,ServiceErrorCode.LOCATION_NOT_FOUND ,500);
                case ServiceErrorCode.NO_PARAM_ERROR:
                    throw new ServiceError(error.message,ServiceErrorCode.NO_PARAM_ERROR,400)
            }
        } else {
            console.log(error);
            return res.status(500).json({error: "Internal Server Error"});
        }
    }
}