import { prisma } from '@/services/prisma.service';

const addUserToDb = async (userId: string): Promise<void> => {
    try {
        await prisma.user.create({ data: { id: userId } });
    } catch {
        return;
    }
};

export { addUserToDb };
