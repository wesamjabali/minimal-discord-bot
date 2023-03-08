import { ChannelType, Message } from 'discord.js';
const parseIntBase10 = (stringToParse: string) => parseInt(stringToParse.split(' ')[0], 10);

const handleCountToInfinity = async (message: Message) => {
    if (message.channel.type !== ChannelType.GuildText) return;

    const messages = await message.channel.messages.fetch({
        limit: 2,
        cache: false
    });

    const lastMessage = messages.last();
    const currentMessage = messages.first();

    const lastMessageNumber = parseIntBase10(lastMessage.content.split(' ')[0]);
    const currentMessageNumber = parseIntBase10(currentMessage.content.split(' ')[0]);

    console.log(lastMessageNumber, currentMessage.content);
    if (lastMessageNumber + 1 !== currentMessageNumber) {
        message.delete();
    }
};

const handleCountToInfinityEdit = async (oldMessage: Message, newMessage: Message) => {
    const oldNumber = parseIntBase10(oldMessage.content.split(' ')[0]);
    const newNumber = parseIntBase10(newMessage.content.split(' ')[0]);

    if (oldNumber !== newNumber) {
        newMessage.delete();
    }
};
export { handleCountToInfinity, handleCountToInfinityEdit };
