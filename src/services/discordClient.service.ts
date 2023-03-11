import { commands } from '@/commands';
import { addUserToDb } from '@/utils/addUser.util';
import { getRoleByName } from '@/utils/getRoleByName.util';
import { Client, Events, GatewayIntentBits, Message } from 'discord.js';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.MessageContent
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
    guild.members.addRole({ role: await getRoleByName('jailed'), user: member.user.id });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
});

client.on('messageUpdate', async (oldMessage: Message, newMessage: Message) => {
    if (newMessage.author.bot) return;
});

export { client };
