import { z } from '@ember-and-oak/validation';

const booleanString = z
  .enum(['true', 'false'])
  .default('false')
  .transform((value) => value === 'true');

export const environmentSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  DEPLOYMENT_ENV: z
    .enum(['local', 'development', 'staging', 'production'])
    .default('local'),
  PORT: z.coerce.number().int().min(1).max(65_535).default(4000),
  DATABASE_URL: z.string().url().startsWith('postgresql://'),
  DATABASE_CHECK_ON_STARTUP: booleanString,
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:3000,http://localhost:3001'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  ERROR_TRACKING_DSN: z.string().url().optional().or(z.literal('')),
  EMAIL_PROVIDER_API_KEY: z.string().optional(),
  ADMIN_CONTENT_API_KEY: z.string().min(32).optional(),
  ADMIN_SESSION_TTL_HOURS: z.coerce.number().int().min(1).max(168).default(8),
  ADMIN_LOGIN_MAX_FAILURES: z.coerce.number().int().min(1).max(20).default(5),
  ADMIN_LOGIN_LOCK_MINUTES: z.coerce
    .number()
    .int()
    .min(1)
    .max(1440)
    .default(15),
  WEB_REVALIDATION_URL: z.string().url().optional(),
  WEB_REVALIDATION_SECRET: z.string().min(32).optional(),
  ASSET_CDN_URL: z.string().url().optional(),
});

export type ApiEnvironment = z.infer<typeof environmentSchema>;

export function loadEnvironment(
  source: NodeJS.ProcessEnv = process.env,
): ApiEnvironment {
  const result = environmentSchema.safeParse(source);

  if (!result.success) {
    const fields = result.error.issues.map(
      (issue) => issue.path.join('.') || 'environment',
    );
    throw new Error(
      `Invalid environment configuration: ${[...new Set(fields)].join(', ')}`,
    );
  }

  return result.data;
}
