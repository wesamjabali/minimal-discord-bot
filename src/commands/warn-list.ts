import { prisma } from '@/services/prisma.service';
import { addUserToDb } from '@/utils/addUser.util';
import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from './Command.class';

export const warnList: Command = {
    data: new SlashCommandBuilder()
        .setName('warn-list')
        .setDescription('List warnings for a user.')
        .addUserOption((option) =>
            option.setName('user').setDescription('The user to list warnings.').setRequired(true)
        )
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const warnedUser = interaction.options.getUser('user', true);

        await addUserToDb(warnedUser.id);

        const warnings = await prisma.warning.findMany({
            where: { userId: warnedUser.id },
            orderBy: { createdAt: 'asc' },
            take: 24
        });
        if (warnings.length === 0) {
            await interaction.reply(`No warnings for <@${warnedUser.id}>`);
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(`${warnings.length} warnings for ${warnedUser.tag}`)
            .setColor(0xfcba03)
            .setThumbnail(warnedUser.avatarURL())
            .setFields(
                warnings.map((warning) => ({
                    name: warning.createdAt.toLocaleDateString(),
                    value: warning.reason
                }))
            );

        await interaction.reply({ embeds: [embed] });
    }
};
