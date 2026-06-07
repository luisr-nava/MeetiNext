import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "../db";
import { AuthEmailServices } from "../emails/services/AuthEmailServices";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      const { name, email } = user;
      await AuthEmailServices.sendPasswordResetToken({
        email,
        name,
        url,
      });
    },
  },

  emailVerification: {
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      const { name, email } = user;

      await AuthEmailServices.sendVerificationEmail({
        name,
        email,
        url,
      });
    },
  },
  user: {
    additionalFields: {
      bio: {
        type: "string",
        required: false,
      },
    },
  },
  plugins: [nextCookies()],
});

