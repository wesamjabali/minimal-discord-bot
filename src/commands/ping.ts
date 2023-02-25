import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command } from './Command.class';

export const ping: Command = {
    data: new SlashCommandBuilder().setName('ping').setDescription('Pong!').toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const interactionTime = interaction.createdTimestamp;
        const initialTime = new Date().getTime();

        const msg = await interaction.reply({
            content: 'Pinging...',
            fetchReply: true
        });

        const finalTime = new Date().getTime();

        msg.edit(
            `Pong!
My Ping: ${initialTime - interactionTime}ms
Round Trip: ${finalTime - interactionTime}ms`
        );
    }
};
