import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
import {addMinutes, subMinutes} from "date-fns";
import cron from 'node-cron'
const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    },
    log: ['query', 'info', 'warn', 'error'],
});

cron.schedule('0 0 * * *', async () => {
    try {
        const now = new Date();
        const cutoff = subMinutes(now, 15);

        const deletedCount = await prisma.otp.deleteMany({
            where: {
                created_at: {
                    lt: cutoff,
                },
            },
        });

        console.log(`[Cron Job] Deleted ${deletedCount.count} expired OTPs at ${now}`);
    } catch (error) {
        console.error('[Cron Job] Failed to clean up OTPs:', error);
    }
});

export default prisma;