import { serverDB } from '@lobechat/database';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { emailService } from '@/server/services/email';

export const auth = betterAuth({
  database: drizzleAdapter(serverDB, {
    provider: 'pg',
  }),
  // custom database fields
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,

    sendResetPasswordEmail: async ({ user, url }: { url: string; user: { email: string } }) => {
      await emailService.sendMail({
        from: 'noreply@lobechat.com',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">Reset Your Password</h1>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">You requested to reset your password for LobeChat.</p>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">Click the button below to reset your password:</p>
            <div style="margin: 30px 0;">
              <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #0066ff; color: white; text-decoration: none; border-radius: 4px; font-size: 16px;">Reset Password</a>
            </div>
            <p style="color: #999; font-size: 14px; margin-top: 30px;">If you didn't request this, please ignore this email.</p>
          </div>
        `,
        subject: 'Reset Your Password - LobeChat',
        text: `Click here to reset your password: ${url}`,
        to: user.email,
      });
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({
      user,
      url,
    }: {
      url: string;
      user: { email: string; name?: string | null };
    }) => {
      await emailService.sendMail({
        from: 'noreply@lobechat.com',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333; font-size: 24px; margin-bottom: 20px;">Welcome to LobeChat 🤯</h1>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">Hi ${user.name || 'there'},</p>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">Thank you for signing up! Please verify your email address to get started.</p>
            <div style="margin: 30px 0;">
              <a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #0066ff; color: white; text-decoration: none; border-radius: 4px; font-size: 16px;">Verify Email</a>
            </div>
            <p style="color: #999; font-size: 14px; margin-top: 30px;">This link will expire in 24 hours.</p>
            <p style="color: #999; font-size: 12px;">If you didn't create an account, please ignore this email.</p>
          </div>
        `,
        subject: 'Verify Your Email - LobeChat',
        text: `Welcome to LobeChat! Click here to verify your email: ${url}`,
        to: user.email,
      });
    },
  },

  user: {
    fields: {
      image: 'avatar',
      name: 'username',
    },
    modelName: 'users',
  },
});
