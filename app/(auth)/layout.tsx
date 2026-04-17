export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-orange-50 via-[#f7f4f0] to-amber-50/60">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
