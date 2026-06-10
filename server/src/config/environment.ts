import dotenv from 'dotenv';
dotenv.config();

const config = {
  firebase: {
    serviceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH ?? '',
    projectId: process.env.FIREBASE_PROJECT_ID ?? '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL ?? '',
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') ?? '',
  },
  server: {
    port: Number(process.env.PORT ?? 3001),
    nodeEnv: process.env.NODE_ENV ?? 'development',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'change-this-secret-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
} as const;

export default config;