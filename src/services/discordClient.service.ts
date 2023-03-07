import { commands } from '@/commands';
import { addUserToDb } from '@/utils/addUser.util';
import { getRoleByName } from '@/utils/getRoleByName.util';
import {
    handleCountToInfinity,
    handleCountToInfinityEdit
} from '@/utils/handleCountToInfinity.util';
import { Client, Events, GatewayIntentBits, Message } from 'discord.js';
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

    if (interaction.isAutocomplete()) {
        commands
            .find(
                (command) => command.data.name === interaction.commandName && command.autocomplete
            )
            ?.autocomplete(interaction);
    }

    if (interaction.isButton()) {
        commands.find((command) =>
            command.actions
                ?.find((action) => action.id === interaction.customId)
                ?.execute(interaction)
        );
    }
});

client.on(Events.GuildMemberAdd, async (member) => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    guild.members.addRole({ role: await getRoleByName('Community Ping'), user: member.user.id });

    const isMuted = await prisma.mute.findFirst({ where: { userId: member.user.id } });
    if (isMuted) {
        guild.members.addRole({ role: await getRoleByName('muted'), user: member.user.id });
    }
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.channel.id === '542205321012051971') handleCountToInfinity(message);
});

client.on('messageUpdate', async (oldMessage: Message, newMessage: Message) => {
    if (newMessage.author.bot) return;
    if (newMessage.channel.id === '542205321012051971') {
        handleCountToInfinityEdit(oldMessage, newMessage);
    }
});

export { client };
