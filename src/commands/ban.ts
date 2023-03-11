import { prisma } from '@/services/prisma.service';
import { addUserToDb } from '@/utils/addUser.util';
import dayjs from 'dayjs';
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import parse from 'parse-duration';
import { Command } from './Command.class';
import { jailUser } from './warn';

export const ban: Command = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user for an amount of time.')
        .addUserOption((option) =>
            option.setName('user').setDescription('The user to ban.').setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('time')
                .setDescription('Length of ban. (e.g. 1h, 1d, 1w, 1m, 1y)')
                .setRequired(true)
        )
        .addStringOption((option) => option.setName('reason').setDescription('Reason for ban.'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const bannedUser = interaction.options.getUser('user', true);
        const time = interaction.options.getString('time', true);
        const reason = interaction.options.getString('reason', false) ?? '[no reason given]';
        const timeMs = parse(time);

        await addUserToDb(bannedUser.id);

        if (!timeMs) {
            await interaction.reply({
                content: 'Invalid time format. (e.g. 1h, 1d, 1w, 1m, 1y)',
                ephemeral: true
            });
            return;
        }
        const endDate = dayjs().add(timeMs, 'ms').toDate();

        await interaction.guild.members.ban(bannedUser.id, { reason });

        await prisma.ban.upsert({
            where: { userId: bannedUser.id },
            create: { userId: bannedUser.id, endDate },
            update: { endDate }
        });
        await jailUser(bannedUser.id, `Banned for ${time} for ${reason}`);

        interaction.reply(`Banned <@${bannedUser.id}> for ${time} for ${reason}`);
    }
};
