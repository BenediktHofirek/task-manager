import { CreateClientConfig } from "@/api/client.gen";

export const createClientConfig: CreateClientConfig = (config) => {

  console.log('inside',
    typeof window === 'undefined' ?
      process.env.API_URL :
      process.env.NEXT_PUBLIC_APP_URL)

  return ({
    ...config,
    baseUrl: typeof window === 'undefined' ?
      process.env.API_URL :
      process.env.NEXT_PUBLIC_APP_URL,
    throwOnError: true
  });
}
