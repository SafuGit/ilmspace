import { prisma } from "./prisma";

export async function getUserId(email: string) {
  if (!email) {
    throw new Error("No email provided");
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  if (!user) {
    throw new Error("User not found in database");
  }

  return user.id;
}