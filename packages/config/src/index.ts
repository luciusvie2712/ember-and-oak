export const ports = {
  web: 3000,
  admin: 3001,
  api: 4000,
  postgres: 5432,
} as const;

export const environments = ["local", "development", "staging", "production"] as const;

export type DeploymentEnvironment = (typeof environments)[number];
