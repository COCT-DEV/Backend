import { Prisma} from "@prisma/client";
import prisma from '../prisma/client'
import hymns from './hymns.json'
import { Version } from "@prisma/client";

const hymnGroups = hymns.hymns


async function insertHymns() {
    try {
        for (const hymnGroup of hymnGroups) {
            const title = hymnGroup.title
            const lyrics = hymnGroup.lyric
            const hymn_number = hymnGroup.hymn_number
            const validVersion = ["TWI", "ENGLISH"].includes(hymnGroup.version.toUpperCase())
                ? hymnGroup.version.toUpperCase()
                : "TWI";


            const hymn = await prisma.hymn.create({
                data: {
                    hymn_number,
                    title,
                    lyrics
                }
            })
            await prisma.hymnVersion.create({
                    data: {
                        hymn_id: hymn.id,
                        version: validVersion as Version
                    }
                })
        }
    } catch (err) {
        console.log(err);
    }
}

insertHymns();