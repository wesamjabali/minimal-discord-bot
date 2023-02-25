import { prisma } from '@/services/prisma.service';
import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { Command } from './Command.class';

export const tagEdit: Command = {
    data: new SlashCommandBuilder()
        .setName('tag-edit')
        .setDescription('Add or edit a tag.')
        .addStringOption((option) =>
            option.setName('name').setDescription('Name of the tag.').setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('content')
                .setDescription(
                    'Content of the tag. Use \\n for new lines. Leave blank to delete tag.'
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const name = interaction.options.getString('name', true);
        const content = interaction.options.getString('content', false);

        if (content) {
            const formattedContent = content.replace(/\\n/g, '\n');
            await prisma.tag.upsert({
                where: { name },
                update: { content: formattedContent },
                create: { name, content: formattedContent }
            });
            interaction.reply(`Tag ${name} updated.`);
            return;
        }

        try {
            await prisma.tag.delete({ where: { name } });
        } catch {
            interaction.reply(`Tag ${name} doesn't exist.`);
            return;
        }
        interaction.reply(`Tag ${name} deleted.`);
    }
};
