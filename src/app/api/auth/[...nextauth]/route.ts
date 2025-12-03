import { prisma } from "@/lib/prisma";
import { sendVerificationRequest } from "@/lib/sendEmail";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import DiscordProvider from "next-auth/providers/discord";

const handler = NextAuth({
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: +(process.env.EMAIL_SERVER_PORT ?? 587),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: sendVerificationRequest
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
});

export { handler as GET, handler as POST };
