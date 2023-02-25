import { prisma } from '@/services/prisma.service';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from './Command.class';

export const tagList: Command = {
    data: new SlashCommandBuilder().setName('tag-list').setDescription('List tags').toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const tags = await prisma.tag.findMany();
        const tagNames = tags.map((tag) => `\`${tag.name}\``).join(', ');

        interaction.reply(`Available tags: ${tagNames}`);
    }
};
