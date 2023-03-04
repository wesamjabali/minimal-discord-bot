import {
    AutocompleteInteraction,
    ButtonInteraction,
    ChatInputCommandInteraction,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    StringSelectMenuInteraction
} from 'discord.js';

export class Command {
    data: RESTPostAPIChatInputApplicationCommandsJSONBody;
    execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
    autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
    actions?: Array<{
        id: string;
        execute: (interaction: ButtonInteraction | StringSelectMenuInteraction) => Promise<void>;
    }>;
}
