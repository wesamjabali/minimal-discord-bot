import { debateCooldowns } from '@/commands/debate';
import { unbanUser } from '@/commands/unban';
import { unjailUser } from '@/commands/unjail';
import cron from 'node-cron';
import { prisma } from './prisma.service';

const start = () => {
    cron.schedule('* * * * *', async () => {
        const bans = await prisma.ban.findMany({ where: { endDate: { lte: new Date() } } });
        const mutes = await prisma.mute.findMany({ where: { endDate: { lte: new Date() } } });

        debateCooldowns.forEach((date, userId) => {
            if (date < new Date()) debateCooldowns.delete(userId);
        });

        const promises = [
            bans.map((ban) => unbanUser(ban.userId)),
            mutes.map((mute) => unjailUser(mute.userId))
        ];

        await Promise.allSettled(promises);
    });
};

const cronService = { start };

export { cronService };
