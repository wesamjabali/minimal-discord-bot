import { unbanUser } from '@/commands/unban';
import { unmuteUser } from '@/commands/unmute';
import cron from 'node-cron';
import { prisma } from './prisma.service';

const start = () => {
    cron.schedule('* * * * *', async () => {
        const bans = await prisma.ban.findMany({ where: { endDate: { lte: new Date() } } });
        const mutes = await prisma.mute.findMany({ where: { endDate: { lte: new Date() } } });

        const promises = [
            bans.map((ban) => unbanUser(ban.userId)),
            mutes.map((mute) => unmuteUser(mute.userId))
        ];

        await Promise.allSettled(promises);
    });
};

const cronService = { start };

export { cronService };
