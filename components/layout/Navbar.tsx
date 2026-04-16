"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, LogOut, Settings, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";
import { useState, useEffect } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const items = useCartStore((state) => state.items);
  const toggleCart = useUIStore((state) => state.toggleCart);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="bg-white border-b border-amber-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🐱</span>
            <span className="text-xl font-bold text-stone-800">
              Gato <span className="text-orange-500">Caina</span>
            </span>
          </Link>

          {/* Nav links - desktop */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/catalogo" className="text-stone-600 hover:text-orange-500 transition-colors font-medium text-sm">
              Catalogo
            </Link>
            <Link href="/catalogo?categoria=comida" className="text-stone-600 hover:text-orange-500 transition-colors font-medium text-sm">
              Comida
            </Link>
            <Link href="/catalogo?categoria=juguetes" className="text-stone-600 hover:text-orange-500 transition-colors font-medium text-sm">
              Juguetes
            </Link>
            <Link href="/catalogo?categoria=accesorios" className="text-stone-600 hover:text-orange-500 transition-colors font-medium text-sm">
              Accesorios
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Carrito — abre el drawer */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-stone-600 hover:text-orange-500 transition-colors"
              aria-label="Abrir carrito"
            >
              <ShoppingCart size={22} />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </button>

            {/* Usuario */}
            {session ? (
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 text-stone-600 hover:text-orange-500 transition-colors rounded-lg">
                  <User size={22} />
                  <span className="hidden md:block text-sm font-medium">
                    {session.user.name?.split(" ")[0] ?? session.user.email?.split("@")[0]}
                  </span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-amber-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 py-1">
                  {session.user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-700 hover:bg-amber-50 transition-colors"
                    >
                      <Settings size={15} />
                      Panel Admin
                    </Link>
                  )}
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-700 hover:bg-amber-50 transition-colors w-full text-left"
                  >
                    <LogOut size={15} />
                    Cerrar Sesion
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/login" className="btn-primary text-sm py-2 px-4">
                Ingresar
              </Link>
            )}

            {/* Menu mobile */}
            <button
              className="md:hidden p-2 text-stone-600 hover:text-orange-500 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-amber-100 py-3 space-y-1">
            {[
              { href: "/catalogo", label: "Catalogo" },
              { href: "/catalogo?categoria=comida", label: "Comida" },
              { href: "/catalogo?categoria=juguetes", label: "Juguetes" },
              { href: "/catalogo?categoria=accesorios", label: "Accesorios" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-stone-600 hover:text-orange-500 hover:bg-amber-50 rounded-lg font-medium text-sm transition-colors"
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
