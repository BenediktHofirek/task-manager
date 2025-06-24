import { auth0 } from "@/lib/auth0";

export default async function UserBadge() {
  const session = await auth0.getSession()

  if (!session) return null;

  const { user } = session;

  return (
    <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-800 p-2 rounded-md shadow-sm max-w-xs">
      <img
        src={user.picture}
        alt={user.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {user.name}
        </span>
        <a
          href="/auth/logout"
          className="text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
        >
          Logout
        </a>
      </div>
    </div>
  );
}
