"use client";

import { useState } from "react";
import { ShoppingCart, Check, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useUIStore } from "@/store/ui";

interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
}

export function AddToCartButton({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (product.stock === 0) {
    return (
      <button
        disabled
        className="btn-primary w-full justify-center py-3.5 opacity-60 cursor-not-allowed"
      >
        Sin stock disponible
      </button>
    );
  }

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });
    openCart();          // Abre el drawer automaticamente
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Selector de cantidad */}
      <div className="flex items-center gap-4">
        <span className="label mb-0 text-sm">Cantidad</span>
        <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-2 text-stone-500 hover:bg-amber-50 hover:text-orange-500 transition-colors"
            aria-label="Reducir cantidad"
          >
            <Minus size={14} />
          </button>
          <span className="px-4 py-2 font-semibold text-stone-800 min-w-[3rem] text-center border-x border-stone-200">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            className="px-3 py-2 text-stone-500 hover:bg-amber-50 hover:text-orange-500 transition-colors"
            aria-label="Aumentar cantidad"
          >
            <Plus size={14} />
          </button>
        </div>
        <span className="text-xs text-stone-400">{product.stock} disponibles</span>
      </div>

      {/* Boton agregar */}
      <button
        onClick={handleAdd}
        className="btn-primary w-full justify-center py-3.5 text-base"
      >
        {added ? (
          <>
            <Check size={20} />
            Agregado al carrito
          </>
        ) : (
          <>
            <ShoppingCart size={20} />
            Agregar al carrito
          </>
        )}
      </button>
    </div>
  );
}
