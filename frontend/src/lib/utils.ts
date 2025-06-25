import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { auth0 } from "./auth0";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type HandlerWithHeaders<T, R> = (
  payload: T & { headers: Record<string, string> },
) => Promise<R>;

export async function withAuthToken<T extends Record<string,any>, R>(
  handler: HandlerWithHeaders<T, R>
): Promise<(payload: T) => Promise<R>> {
  const authToken = await auth0.getAccessToken();

  console.log('pruchod')
  return (payload: T) => handler({
    ...payload,
    headers: {
      ...(payload as any).headers,
      Authorization: `Bearer ${authToken}`,
    },
  });
}
