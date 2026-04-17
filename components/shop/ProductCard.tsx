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
    <Link
      href={`/productos/${product.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Imagen */}
      <div className="relative aspect-square overflow-hidden bg-stone-100">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-5xl">🐱</div>
        )}

        {/* Overlay categoria */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-orange-500 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wide">
            {product.category.name}
          </span>
        </div>

        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-stone-800 text-white text-xs font-bold px-4 py-2 rounded-full tracking-wide">
              Sin stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-stone-800 text-sm leading-snug line-clamp-2 flex-1 mb-3 group-hover:text-orange-600 transition-colors duration-200">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-stone-900">
            {formatPrice(product.price)}
          </p>
          {product.stock > 0 && product.stock <= 5 && (
            <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
              ¡Últimas {product.stock}!
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
