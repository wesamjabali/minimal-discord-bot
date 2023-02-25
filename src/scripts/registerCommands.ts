import { commands } from '@/commands';
import { REST, Routes } from 'discord.js';
import { config as dotEnvConfig } from 'dotenv';
dotEnvConfig();

const token = process.env.TOKEN ?? '';
const clientId = process.env.CLIENT_ID ?? '';
const guildId = process.env.GUILD_ID ?? '';
const rest = new REST({ version: '10' }).setToken(token);

console.log(`Started refreshing ${commands.length} application (/) commands.`);

rest.put(Routes.applicationGuildCommands(clientId, guildId), {
    body: commands.map((command) => command.data)
})
    .then((data: Array<{ name: string }>) => {
        console.log(
            `Successfully reloaded ${data.length} application (/) commands. Commands: ${data
                .map((command) => command.name)
                .join(', ')}`
        );
    })
    .catch((err) => {
        console.log(err);
    });
