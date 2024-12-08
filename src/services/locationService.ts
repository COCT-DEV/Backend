import prisma from "../prisma/client";
import {ServiceError, ServiceErrorCode} from "../utils/errors/ServiceErrors";
import church from "../routes/church";

export const listLocations = async (): Promise<any> => {
    try {
        const locations = await prisma.churchLocations.findMany();
        return  locations;
    } catch (error) {
        if (error instanceof ServiceError) {
            throw new ServiceError(error.message,ServiceErrorCode.LOCATION_NOT_FOUND ,500)
        } else {
            throw error;
        }
    }
}
export const searchLocation = async (searchString: string | undefined): Promise<any> => {
    try {
        if (!searchString) {
            throw new ServiceError("Search String is required", ServiceErrorCode.NO_PARAM_ERROR,400)
        }
        const locations = await prisma.churchLocations.findMany({
            where: {city: searchString}
        });

        return locations;
    }  catch (error) {
        console.log(error)
        if (error instanceof ServiceError) {
            switch (error.code) {
                case ServiceErrorCode.LOCATION_NOT_FOUND:
                    throw new ServiceError(error.message,ServiceErrorCode.LOCATION_NOT_FOUND ,500);
                case ServiceErrorCode.NO_PARAM_ERROR:
                    throw new ServiceError(error.message,ServiceErrorCode.NO_PARAM_ERROR,400)
            }

        } else {
            throw error;
        }
    }
}