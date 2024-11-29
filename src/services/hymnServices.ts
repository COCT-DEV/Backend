import { Version } from "@prisma/client";
import prisma from "../prisma/client"
import { PrismaClientValidationError } from "@prisma/client/runtime/library";

export class HymnServiceError extends Error {
    constructor(
        message: string,
        public code: 'DATABASE_ERROR' | 'NOT_FOUND'
    ) {
        super(message);
        this.name = 'UserServiceError';
    }
}

export const listTitles = async (version: Version) => {
    try {
        const titles = await prisma.hymnVersion.findMany({
            select: {
                hymn: {
                    select: {
                        id: true,
                        title: true,
                        hymn_number: true
                    }
                },
            },
            where : {
                version:version
            }
        })
        const sortedTitles = titles.sort((a, b) => {
            const hymnNumberA = parseFloat(a.hymn.hymn_number);
            const hymnNumberB = parseFloat(b.hymn.hymn_number);
            return hymnNumberA - hymnNumberB;
        });
        
        return sortedTitles;
    } catch (err) {
        if (err instanceof PrismaClientValidationError) {
            throw new HymnServiceError("Invalid version(twi or english", 'NOT_FOUND')
        }
        else {
            throw new HymnServiceError("An unexpected error occurred", "DATABASE_ERROR");
        }
    }
}

//[ ]: REWRITE THE ERRORS HERE, NOT GOOD
export const getHymnal = async (hymnId: string) => {
    try {
        const hymn = await prisma.hymn.findFirst({
            where: {
                id: hymnId
            }
        });
        if (hymn === null) {
            throw new HymnServiceError("Hymn not found", "NOT_FOUND")
        }
        return hymn
    } catch (err) {
        if (err instanceof HymnServiceError) {
            throw err
        } else {
            throw new HymnServiceError("An unexpected error occurred", "DATABASE_ERROR");
        }
    }
}