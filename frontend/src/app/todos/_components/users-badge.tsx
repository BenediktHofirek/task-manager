import { auth0 } from "@/lib/auth0";
import Image from "next/image";
import { connection } from "next/server";

export default async function UserBadge() {
  await connection();
  const session = await auth0.getSession();

  if (!session) return null;

  const { user } = session;

  return (
    <div
      className="flex max-w-xs items-center space-x-3 rounded-md bg-gray-100 p-2 shadow-sm
        dark:bg-gray-800"
    >
     <Image
        src="/api/user-image"
        alt={user.name || ""}
        width={40}
        height={40}
        className="rounded-full object-cover"
      />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {user.name}
        </span>
        <a
          href="/auth/logout"
          className="text-xs text-red-600 hover:text-red-800 dark:text-red-400
            dark:hover:text-red-600"
        >
          Logout
        </a>
      </div>
    </div>
  );
}
