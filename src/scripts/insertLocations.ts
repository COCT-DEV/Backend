import places from "./places.json"
import prisma from "../prisma/client";

interface locationArr {
    google_map_url: string,
    church_name: string,
    address: string,
    city: string,
}
const objArr: locationArr[] = []
places.map(async (place: any) => {
    const google_map_url = place.searchPageUrl as string;
    const church_name = place.title as string;
    const address = place.address as string;
    const street_name = place.street as string;
    const city = place.city as string;
    objArr.push({google_map_url, church_name, address, street_name, city} as locationArr);
})
const insertLoc = async () => {
    await prisma.churchLocations.createMany(
        {
            data: objArr,
            skipDuplicates: true
        }
    )
}

insertLoc();