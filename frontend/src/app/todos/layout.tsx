import UserBadge from "./_components/users-badge";

export default function TodosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex h-24 w-full items-center justify-between p-4">
        <h1 className="fond-bold text-primary text-3xl">Todo manager</h1>
        <UserBadge />
      </header>
      <div>{children}</div>
    </div>
  );
}
