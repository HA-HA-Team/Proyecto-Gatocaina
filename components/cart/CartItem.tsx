"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types";

export function CartItem({ item }: { item: CartItemType }) {
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  return (
    <div className="flex gap-3 py-4 border-b border-amber-100 last:border-0">
      {/* Imagen */}
      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-amber-50 shrink-0">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-2xl">🐱</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-800 line-clamp-2 leading-snug mb-1">
          {item.name}
        </p>
        <p className="text-sm font-bold text-orange-500 mb-2">
          {formatPrice(item.price)}
        </p>

        {/* Controles de cantidad */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
            className="w-6 h-6 rounded-full border border-stone-200 flex items-center justify-center hover:border-orange-400 hover:text-orange-500 transition-colors text-stone-500"
            aria-label="Reducir"
          >
            <Minus size={11} />
          </button>
          <span className="text-sm font-semibold text-stone-700 w-6 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
            className="w-6 h-6 rounded-full border border-stone-200 flex items-center justify-center hover:border-orange-400 hover:text-orange-500 transition-colors text-stone-500"
            aria-label="Aumentar"
          >
            <Plus size={11} />
          </button>
        </div>
      </div>

      {/* Subtotal y eliminar */}
      <div className="flex flex-col items-end justify-between shrink-0">
        <p className="text-sm font-bold text-stone-700">
          {formatPrice(item.price * item.quantity)}
        </p>
        <button
          onClick={() => removeItem(item.productId)}
          className="text-stone-300 hover:text-red-400 transition-colors p-1"
          aria-label="Eliminar producto"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
