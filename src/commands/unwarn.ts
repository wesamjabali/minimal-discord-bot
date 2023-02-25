import { prisma } from '@/services/prisma.service';
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { Command } from './Command.class';

export const unwarn: Command = {
    data: new SlashCommandBuilder()
        .setName('unwarn')
        .setDescription("Remove a user's last warning.")
        .addUserOption((option) =>
            option.setName('user').setDescription('The user to unwarn.').setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const unwarnedUser = interaction.options.getUser('user', true);
        try {
            const lastWarning = await prisma.warning.findFirst({
                where: { userId: unwarnedUser.id },
                orderBy: { createdAt: 'desc' },
                take: 1
            });
            await prisma.warning.delete({ where: { id: lastWarning.id } });
            interaction.reply(`Unwarned <@${unwarnedUser.id}>`);
        } catch {
            interaction.reply(`No warnings for <@${unwarnedUser.id}>`);
        }
    }
};
