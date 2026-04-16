"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Esperar a que Zustand hydrate desde localStorage
  useEffect(() => setMounted(true), []);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-9 w-48 bg-stone-200 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-4 h-32 animate-pulse bg-stone-50" />
            ))}
          </div>
          <div className="card p-6 h-64 animate-pulse bg-stone-50" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h1 className="text-3xl font-bold text-stone-800 mb-3">
          Tu carrito esta vacio
        </h1>
        <p className="text-stone-500 mb-8">
          Explora nuestro catalogo y encuentra lo que tu gato necesita
        </p>
        <Link href="/catalogo" className="btn-primary text-base px-8 py-3">
          Ver catalogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-stone-800">Tu carrito</h1>
        <button
          onClick={clearCart}
          className="text-sm text-stone-400 hover:text-red-400 transition-colors"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="card p-5 flex gap-4">
              {/* Imagen */}
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-amber-50 shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-3xl">🐱</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-stone-800 mb-1 line-clamp-2 leading-snug">
                  {item.name}
                </p>
                <p className="text-orange-500 font-bold mb-3">
                  {formatPrice(item.price)} / ud.
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="px-3 py-2 text-stone-500 hover:bg-amber-50 hover:text-orange-500 transition-colors"
                      aria-label="Reducir cantidad"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="px-4 py-2 font-semibold text-stone-700 border-x border-stone-200 min-w-[3rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-3 py-2 text-stone-500 hover:bg-amber-50 hover:text-orange-500 transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-2 text-stone-300 hover:text-red-400 transition-colors"
                    aria-label="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Subtotal */}
              <div className="shrink-0 text-right">
                <p className="text-lg font-bold text-stone-800">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}

          <Link
            href="/catalogo"
            className="btn-secondary w-fit text-sm"
          >
            ← Seguir comprando
          </Link>
        </div>

        {/* Resumen del pedido */}
        <div>
          <div className="card p-6 sticky top-24">
            <h2 className="text-lg font-bold text-stone-800 mb-5 pb-4 border-b border-amber-100">
              Resumen del pedido
            </h2>

            <div className="space-y-3 mb-5 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>
                  Subtotal ({totalItems} {totalItems === 1 ? "articulo" : "articulos"})
                </span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Envio</span>
                <span className="text-green-600 font-semibold">Gratis</span>
              </div>
            </div>

            <div className="flex justify-between font-bold text-stone-800 text-xl pt-4 border-t border-amber-100 mb-6">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            <Link
              href="/checkout"
              className="btn-primary w-full justify-center py-3.5 text-base"
            >
              Proceder al pago
              <ArrowRight size={18} />
            </Link>

            <p className="text-xs text-stone-400 text-center mt-4">
              Pago 100% seguro y simulado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
