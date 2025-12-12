export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen p-6 md:pl-[250px]">{children}</div>;
}
