import Link from "next/link";
import { LayoutDashboard, Package, Tag, ShoppingBag, Store } from "lucide-react";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: Tag },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-stone-900 text-stone-100 flex flex-col">
        <div className="px-4 py-5 border-b border-stone-700">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Panel Admin</p>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-stone-300 hover:bg-stone-700 hover:text-white transition-colors"
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-stone-700">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-stone-400 hover:text-white transition-colors"
          >
            <Store size={14} />
            Ver tienda
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-stone-50 overflow-auto">
        {children}
      </main>
    </div>
  );
}
