import { Session } from "next-auth";
import { prisma } from "./prisma";

export async function getUserId(session: Session) {
  if (!session?.user?.email) {
    throw new Error("No email found in session");
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
    select: {
      id: true,
    },
  });

  return user?.id || null;
}