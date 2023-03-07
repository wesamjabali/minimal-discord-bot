import { ChannelType, Message } from 'discord.js';

const handleCountToInfinity = async (message: Message) => {
    if (message.channel.type !== ChannelType.GuildText) return;

    const messages = await message.channel.messages.fetch({
        limit: 2,
        cache: false
    });

    const lastMessage = messages.last();
    const currentMessage = messages.first();

    const lastMessageNumber = parseInt(lastMessage.content.split(' ')[0]);
    const currentMessageNumber = parseInt(currentMessage.content.split(' ')[0]);

    console.log(lastMessageNumber, currentMessage.content);
    if (lastMessageNumber + 1 !== currentMessageNumber) {
        message.delete();
    }
};

const handleCountToInfinityEdit = async (oldMessage: Message, newMessage: Message) => {
    const oldNumber = parseInt(oldMessage.content.split(' ')[0]);
    const newNumber = parseInt(newMessage.content.split(' ')[0]);

    if (oldNumber !== newNumber) {
        newMessage.delete();
    }
};
export { handleCountToInfinity, handleCountToInfinityEdit };
