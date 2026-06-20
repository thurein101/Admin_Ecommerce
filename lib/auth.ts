import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { Resend } from "resend";
import { prisma } from "./prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    prompt: "select_account",
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({
      user,
      url,
    }) => {
      try {
        await resend.emails.send({
          from: "E-Commerce Store <onboarding@resend.dev>",
          to: user.email,
          subject: "Verify your email address",
          html: `<a href="${url}">Verify</a>`,
        });
      } catch (err) {
        // ဒီနေရာမှာ Error ကိုသေချာဖမ်းပါ
        console.error("CRITICAL: Email failed to send:", err);
        throw new Error("Failed to send verification email"); // Auth ကို error ပစ်ခိုင်းပါ
      }
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  // User Session ထဲမှာ Role (Admin/User) ကို ထည့်ပေးထားရန်
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "USER",
      },
    },
  },
  session: {
    cookieCache: {
      enabled: false,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  trustedOrigins: ["https://thushop.vercel.app/"], 
}
  
);
