"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { useUIStore } from "@/store/ui";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { CartItem } from "./CartItem";

export function CartDrawer() {
  const { cartOpen, closeCart } = useUIStore();
  const items = useCartStore((s) => s.items);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  // Bloquear scroll del body cuando el drawer esta abierto
  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen]);

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeCart]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          cartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Carrito de compras"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-orange-500" />
            <h2 className="text-lg font-bold text-stone-800">Tu carrito</h2>
            {totalItems > 0 && (
              <span className="text-sm text-stone-400 font-normal">
                ({totalItems} {totalItems === 1 ? "articulo" : "articulos"})
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Cerrar carrito"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="font-semibold text-stone-700 mb-2">Tu carrito esta vacio</h3>
              <p className="text-stone-400 text-sm mb-6">
                Agrega productos para tu gatito favorito
              </p>
              <Link href="/catalogo" onClick={closeCart} className="btn-primary">
                Ver catalogo
              </Link>
            </div>
          ) : (
            <div>
              {items.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer con resumen */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-amber-100 bg-amber-50 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-stone-600 text-sm">Subtotal</span>
              <span className="text-2xl font-bold text-stone-800">
                {formatPrice(total)}
              </span>
            </div>

            <div className="space-y-2">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="btn-primary w-full justify-center py-3"
              >
                Ir al checkout
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/carrito"
                onClick={closeCart}
                className="btn-secondary w-full justify-center py-2.5 text-sm"
              >
                Ver carrito completo
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
