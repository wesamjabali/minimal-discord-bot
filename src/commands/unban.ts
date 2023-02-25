import { client } from '@/services/discordClient.service';
import { prisma } from '@/services/prisma.service';
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { Command } from './Command.class';

export const unban: Command = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unban a user.')
        .addUserOption((option) =>
            option.setName('user').setDescription('The user to unban.').setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const bannedUser = interaction.options.getUser('user', true);
        await unbanUser(bannedUser.id);
        interaction.reply(`Unbanned <@${bannedUser.id}>`);
    }
};

const unbanUser = async (userId: string) => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    await guild.members.unban(userId);
    await prisma.ban.delete({ where: { userId } });
};

export { unbanUser };
