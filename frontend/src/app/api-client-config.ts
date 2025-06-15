import { CreateClientConfig } from "@/api/client.gen";

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  baseUrl: process.env.NEXT_PUBLIC_APP_URL,
  throwOnError: true
});
