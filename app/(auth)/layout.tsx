export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-b from-amber-50 to-orange-50">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
