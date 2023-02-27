import { prisma } from '@/services/prisma.service';
import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    SlashCommandBuilder
} from 'discord.js';
import { Command } from './Command.class';

export const tag: Command = {
    data: new SlashCommandBuilder()
        .setName('tag')
        .setDescription('View a tag')
        .addStringOption((option) =>
            option
                .setName('name')
                .setDescription('Name of the tag.')
                .setRequired(true)
                .setAutocomplete(true)
        )
        .addUserOption((option) =>
            option.setName('user').setDescription('User to \\@mention in the response.')
        )
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const name = interaction.options.getString('name', true);
        const tag = await prisma.tag.findUnique({ where: { name } });
        const user = interaction.options.getUser('user', false);

        if (!tag.content) {
            interaction.reply(`Tag ${name} doesn't exist.`);
            return;
        }

        interaction.reply(`${user ? user + ':\n' : ''}${tag.content}`);
    },
    async autocomplete(interaction: AutocompleteInteraction) {
        const focusedValue = interaction.options.getFocused();
        const tags = (
            await prisma.tag.findMany({ where: { name: { contains: focusedValue } } })
        ).map((t) => ({ name: t.name, value: t.name }));

        interaction.respond(tags);
    }
};
