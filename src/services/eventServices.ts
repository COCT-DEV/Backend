import prisma from "../prisma/client";
import { Event } from "@prisma/client";


export const getEvents = async():Promise<Event[]> => {
       const events = await prisma.event.findMany();
       return events;
}