import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string;
    stock: number;
    category: { name: string };
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const images = JSON.parse(product.images) as string[];
  const firstImage = images[0];

  return (
    <Link href={`/productos/${product.slug}`} className="card group cursor-pointer flex flex-col">
      {/* Imagen */}
      <div className="relative aspect-square overflow-hidden bg-amber-50">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-6xl">🐱</div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-stone-700 text-xs font-semibold px-3 py-1 rounded-full">
              Sin stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-1">
          {product.category.name}
        </p>
        <h3 className="font-medium text-stone-800 text-sm leading-snug line-clamp-2 flex-1 mb-3">
          {product.name}
        </h3>
        <p className="text-lg font-bold text-stone-800">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
