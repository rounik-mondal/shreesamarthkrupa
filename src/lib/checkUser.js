import { currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/db';

export const checkUser = async () => {
  const user = await currentUser();

  // 1. If not logged in, return null
  if (!user) {
    return null;
  }

  // 2. Check if user exists in DB
  const loggedInUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  // 3. If exists, return
  if (loggedInUser) {
    return loggedInUser;
  }

  // 4. If not, create new Customer
  const newUser = await prisma.user.create({
    data: {
      id: user.id, 
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      // Role line removed
    },
  });

  return newUser;
};