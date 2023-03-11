import { client } from '@/services/discordClient.service';
import { prisma } from '@/services/prisma.service';
import { getRoleByName } from '@/utils/getRoleByName.util';
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { Command } from './Command.class';

export const unjail: Command = {
    data: new SlashCommandBuilder()
        .setName('unjail')
        .setDescription('Unjail a user.')
        .addUserOption((option) =>
            option.setName('user').setDescription('The user to unjail.').setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const mutedUser = interaction.options.getUser('user', true);
        await unjailUser(mutedUser.id);
        interaction.reply(`Unjailed <@${mutedUser.id}>`);
    }
};

const unjailUser = async (userId: string) => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);

    await guild.members.removeRole({ role: await getRoleByName('jailed'), user: userId });

    await prisma.mute.delete({ where: { userId } });
};

export { unjailUser };
