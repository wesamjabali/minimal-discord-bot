import { commands } from '@/commands';
import { addUserToDb } from '@/utils/addUser.util';
import { getRoleByName } from '@/utils/getRoleByName.util';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import { prisma } from './prisma.service';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration
    ]
});

client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
    addUserToDb(interaction.user.id);

    if (interaction.isChatInputCommand()) {
        commands
            .find((command) => command.data.name === interaction.commandName)
            ?.execute(interaction);
    }
});

client.on(Events.GuildMemberAdd, async (member) => {
    const isMuted = await prisma.mute.findFirst({ where: { userId: member.user.id } });
    if (isMuted) {
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        guild.members.addRole({ role: await getRoleByName('muted'), user: member.user.id });
    }
});

export { client };
