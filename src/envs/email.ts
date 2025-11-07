import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const getEmailConfig = () => {
  return createEnv({
    runtimeEnv: {
      SMTP_HOST: process.env.SMTP_HOST,
      SMTP_PASS: process.env.SMTP_PASS,
      SMTP_PORT: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined,
      SMTP_SECURE: process.env.SMTP_SECURE === 'true',
      SMTP_SERVICE: process.env.SMTP_SERVICE,
      SMTP_USER: process.env.SMTP_USER,
    },

    server: {
      SMTP_HOST: z.string().optional(),
      SMTP_PASS: z.string().optional(),
      SMTP_PORT: z.number().int().positive().optional(),
      SMTP_SECURE: z.boolean().optional(),
      SMTP_SERVICE: z.string().optional(),
      SMTP_USER: z.string().optional(),
    },
  });
};

export const emailEnv = getEmailConfig();
