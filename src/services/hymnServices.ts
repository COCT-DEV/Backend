import prisma from "../prisma/client"


export const listTitle = async () => {
    const titles = await prisma.hymn.findMany({
        select: {
            title: true,
        }
    })
    console.log(titles);
}