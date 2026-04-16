import { db } from "@/lib/db";
import { ProductCard } from "@/components/shop/ProductCard";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catalogo",
  description: "Encuentra todo lo que tu gato necesita en Gato Caina",
};

interface PageProps {
  searchParams: { categoria?: string; q?: string };
}

export default async function CatalogoPage({ searchParams }: PageProps) {
  const { categoria, q } = searchParams;

  const [products, categories] = await Promise.all([
    db.product.findMany({
      where: {
        isActive: true,
        ...(categoria ? { category: { slug: categoria } } : {}),
        ...(q ? { name: { contains: q } } : {}),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const activeCategory = categories.find((c) => c.slug === categoria);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-1">
          {activeCategory ? activeCategory.name : "Todos los productos"}
        </h1>
        <p className="text-stone-500">
          {products.length} producto{products.length !== 1 ? "s" : ""} disponible
          {products.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filtros de categoria */}
      <div className="flex gap-2 flex-wrap mb-8">
        <Link
          href="/catalogo"
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
            !categoria
              ? "bg-orange-500 text-white border-orange-500"
              : "bg-white text-stone-600 border-stone-200 hover:border-orange-300 hover:text-orange-500"
          )}
        >
          Todos
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/catalogo?categoria=${cat.slug}`}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors border",
              categoria === cat.slug
                ? "bg-orange-500 text-white border-orange-500"
                : "bg-white text-stone-600 border-stone-200 hover:border-orange-300 hover:text-orange-500"
            )}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Grid de productos */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-6xl mb-4">🐱</div>
          <h2 className="text-xl font-semibold text-stone-700 mb-2">
            No hay productos aqui todavia
          </h2>
          <p className="text-stone-400 mb-6">
            Prueba con otra categoria o vuelve pronto
          </p>
          <Link href="/catalogo" className="btn-secondary">
            Ver todos los productos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
