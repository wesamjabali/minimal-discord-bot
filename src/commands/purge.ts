import { addUserToDb } from '@/utils/addUser.util';
import {
    ChannelType,
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder
} from 'discord.js';
import { Command } from './Command.class';

export const purge: Command = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Purge up to 100 messages.')
        .addIntegerOption((option) =>
            option
                .setName('amount')
                .setDescription('Amount of messages to purge.')
                .setMinValue(1)
                .setMaxValue(100)
                .setRequired(true)
        )
        .addUserOption((option) =>
            option.setName('user').setDescription('User to purge messages from.')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const amount = interaction.options.getInteger('amount', true);
        const user = interaction.options.getUser('user', false);

        if (user) {
            addUserToDb(user.id);
        }

        if (interaction.channel.type !== ChannelType.GuildText) return;

        const messages = await interaction.channel.messages.fetch({
            limit: amount,
            cache: false
        });

        messages.filter((message) => (user ? message.author.id === user.id : true));
        await interaction.channel.bulkDelete(messages);

        interaction.reply({
            content: `Purged ${amount} messages${user ? ` from <@${user.id}>` : ''}`,
            ephemeral: true
        });
    }
};
