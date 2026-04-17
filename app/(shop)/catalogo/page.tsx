import { db } from "@/lib/db";
import { ProductCard } from "@/components/shop/ProductCard";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Encuentra todo lo que tu gato necesita en Pelusas Tienda Animal",
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
        <h1 className="text-3xl font-bold text-stone-900 mb-1">
          {activeCategory ? activeCategory.name : "Todos los productos"}
        </h1>
        <p className="text-stone-400 text-sm">
          {products.length} producto{products.length !== 1 ? "s" : ""} disponible
          {products.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filtros + Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        {/* Categorías */}
        <div className="flex gap-2 flex-wrap flex-1">
          <Link
            href="/catalogo"
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 border",
              !categoria
                ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                : "bg-white text-stone-500 border-stone-200 hover:border-orange-300 hover:text-orange-500 shadow-sm"
            )}
          >
            Todos
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalogo?categoria=${cat.slug}`}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 border",
                categoria === cat.slug
                  ? "bg-orange-500 text-white border-orange-500 shadow-sm"
                  : "bg-white text-stone-500 border-stone-200 hover:border-orange-300 hover:text-orange-500 shadow-sm"
              )}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Búsqueda */}
        <form method="GET" action="/catalogo" className="flex items-center">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300" />
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Buscar productos..."
              className="pl-9 pr-4 py-2 text-sm bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent w-56 shadow-sm placeholder:text-stone-300"
            />
          </div>
        </form>
      </div>

      {/* Grid de productos */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          <div className="text-6xl mb-5">🐱</div>
          <h2 className="text-xl font-bold text-stone-800 mb-2">
            No hay productos aquí todavía
          </h2>
          <p className="text-stone-400 mb-8 max-w-xs">
            Prueba con otra categoría o vuelve pronto
          </p>
          <Link href="/catalogo" className="btn-primary">
            Ver todos los productos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
