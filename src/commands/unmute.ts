import { client } from '@/services/discordClient.service';
import { prisma } from '@/services/prisma.service';
import { getRoleByName } from '@/utils/getRoleByName.util';
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { Command } from './Command.class';

export const unmute: Command = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmute a user.')
        .addUserOption((option) =>
            option.setName('user').setDescription('The user to unmute.').setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const mutedUser = interaction.options.getUser('user', true);
        await unmuteUser(mutedUser.id);
        interaction.reply(`Unmuted <@${mutedUser.id}>`);
    }
};

const unmuteUser = async (userId: string) => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);

    const promises = [
        guild.members.removeRole({ role: await getRoleByName('jailed'), user: userId }),
        guild.members.removeRole({ role: await getRoleByName('muted'), user: userId })
    ];

    await Promise.allSettled(promises);
    await prisma.mute.delete({ where: { userId } });
};

export { unmuteUser };
