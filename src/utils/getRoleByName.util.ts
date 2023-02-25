import { client } from '@/services/discordClient.service';

const getRoleByName = async (name: string) => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const role = guild.roles.cache.find((role) => role.name.toLowerCase() === name.toLowerCase());
    return role;
};

export { getRoleByName };
