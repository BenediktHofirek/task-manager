import Link from "next/link";

export default function Home() {
  return (
    <div>
      Hello from home!
      <Link href="/todos" className="text-2xl">Todos</Link>
    </div>
  );
}
