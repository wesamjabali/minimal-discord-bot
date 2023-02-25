import { config as dotEnvConfig } from 'dotenv';
import { client } from './services/discordClient.service';
import { prisma } from './services/prisma.service';
import { cronService } from './services/cron.service';
dotEnvConfig();
(async () => {
    await prisma.$connect();
    console.log('Connected to database');
    await client.login(process.env.TOKEN);
    cronService.start();
    console.log('Started cron job');
})();
