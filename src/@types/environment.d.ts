declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REDIS_PASSWORD: string;
      DATABASE_URL: String;
    }
  }
}
export {};
