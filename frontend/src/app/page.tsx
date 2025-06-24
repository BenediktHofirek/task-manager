import Link from "next/link";

export default async function HomePage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-start pt-[30vh]">
      <h1 className="text-6xl font-bold">Todo Manager</h1>
      <div className="mt-16 flex gap-16">
        <Link
          href="/auth/login?screen_hint=signup"
          className="border-border bg-secondary text-secondary-foreground rounded-3xl border-4 px-6
            py-4 text-2xl"
        >
          Sign up
        </Link>

        <Link
          href="/auth/login"
          className="border-primary bg-primary text-primary-foreground rounded-3xl border-4 px-6 py-4
            text-2xl"
        >
          Log in
        </Link>
      </div>
    </div>
  );
}
