import { prisma } from '@/services/prisma.service';
import { addUserToDb } from '@/utils/addUser.util';
import { getRoleByName } from '@/utils/getRoleByName.util';
import dayjs from 'dayjs';
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import parse from 'parse-duration';
import { Command } from './Command.class';

export const mute: Command = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mute a user for an amount of time.')
        .addUserOption((option) =>
            option.setName('user').setDescription('The user to mute.').setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('time')
                .setDescription('Length of mute. (e.g. 1h, 1d, 1w, 1m, 1y)')
                .setRequired(true)
        )
        .addBooleanOption((option) =>
            option.setName('jail').setDescription('Give the muted user the jail role.')
        )
        .addStringOption((option) => option.setName('reason').setDescription('Reason for mute.'))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const mutedUser = interaction.options.getUser('user', true);
        const time = interaction.options.getString('time', true);
        const reason = interaction.options.getString('reason', false) ?? '[no reason given]';
        const isJailed = interaction.options.getBoolean('jail', false) ?? true;
        const timeMs = parse(time);

        await addUserToDb(mutedUser.id);

        if (!timeMs) {
            await interaction.reply({
                content: 'Invalid time format. (e.g. 1h, 1d, 1w, 1m, 1y)',
                ephemeral: true
            });
            return;
        }
        const endDate = dayjs().add(timeMs, 'ms').toDate();

        await interaction.guild.members.addRole({
            user: mutedUser.id,
            role: isJailed ? await getRoleByName('jailed') : await getRoleByName('muted'),
            reason
        });

        await prisma.mute.upsert({
            where: { userId: mutedUser.id },
            create: { userId: mutedUser.id, endDate },
            update: { endDate }
        });

        interaction.reply(`Muted <@${mutedUser.id}> for ${time} for ${reason}`);
    }
};
