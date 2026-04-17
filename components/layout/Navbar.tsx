"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, LogOut, Settings, Menu, X, Package } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import { useState, useEffect } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const items = useCartStore((state) => state.items);
  const toggleCart = useUIStore((state) => state.toggleCart);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-stone-200/60"
          : "bg-white/80 backdrop-blur-sm border-b border-stone-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🐱</span>
            <span className="text-lg font-bold text-stone-900">
              Pelusas <span className="text-orange-500">Tienda Animal</span>
            </span>
          </Link>

          {/* Nav links - desktop */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: "/catalogo", label: "Catálogo" },
              { href: "/catalogo?categoria=comida", label: "Comida" },
              { href: "/catalogo?categoria=juguetes", label: "Juguetes" },
              { href: "/catalogo?categoria=accesorios", label: "Accesorios" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 text-sm font-medium text-stone-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-150"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Carrito */}
            <button
              onClick={toggleCart}
              className="relative p-2.5 text-stone-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-150"
              aria-label="Abrir carrito"
            >
              <ShoppingCart size={20} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-sm">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>

            {/* Usuario */}
            {session ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 text-stone-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-150">
                  <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center">
                    <User size={14} className="text-orange-600" />
                  </div>
                  <span className="hidden md:block text-sm font-semibold">
                    {session.user.name?.split(" ")[0] ?? session.user.email?.split("@")[0]}
                  </span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-stone-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 py-2 origin-top-right">
                  <div className="px-4 py-2.5 border-b border-stone-50 mb-1">
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Cuenta</p>
                    <p className="text-sm font-medium text-stone-700 truncate mt-0.5">
                      {session.user.email}
                    </p>
                  </div>
                  {session.user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      <Settings size={15} />
                      Panel Admin
                    </Link>
                  )}
                  <Link
                    href="/mis-pedidos"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-700 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                  >
                    <Package size={15} />
                    Mis pedidos
                  </Link>
                  <div className="border-t border-stone-50 mt-1 pt-1">
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-stone-500 hover:bg-red-50 hover:text-red-500 transition-colors w-full text-left"
                    >
                      <LogOut size={15} />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link href="/login" className="btn-primary text-sm py-2 px-4">
                Ingresar
              </Link>
            )}

            {/* Menu mobile */}
            <button
              className="md:hidden p-2.5 text-stone-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-all duration-150"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-stone-100 py-3 space-y-1">
            {[
              { href: "/catalogo", label: "Catálogo" },
              { href: "/catalogo?categoria=comida", label: "Comida" },
              { href: "/catalogo?categoria=juguetes", label: "Juguetes" },
              { href: "/catalogo?categoria=accesorios", label: "Accesorios" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-stone-600 hover:text-orange-500 hover:bg-orange-50 rounded-xl font-medium text-sm transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
