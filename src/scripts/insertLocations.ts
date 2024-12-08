import places from "./places.json"
import prisma from "../prisma/client";

const objArr = []
places.map(async (place: any) => {
    const google_map_url = place.searchPageUrl;
    const church_name = place.title;
    const address = place.address;
    const street_name = place.street;
    const city = place.city;
    objArr.push({google_map_url, church_name, address, street_name, city});
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