import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { ArrowLeft, Package, Tag } from "lucide-react";
import type { Metadata } from "next";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
  });
  if (!product) return { title: "Producto no encontrado" };
  return {
    title: product.name,
    description: product.description ?? `Compra ${product.name} en Gato Caina`,
  };
}

export default async function ProductoPage({ params }: PageProps) {
  const product = await db.product.findUnique({
    where: { slug: params.slug, isActive: true },
    include: { category: true },
  });

  if (!product) notFound();

  const images = JSON.parse(product.images) as string[];
  const firstImage = images[0];

  // Productos relacionados de la misma categoria
  const related = await db.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      NOT: { id: product.id },
    },
    include: { category: true },
    take: 4,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb / back */}
      <Link
        href="/catalogo"
        className="inline-flex items-center gap-2 text-stone-500 hover:text-orange-500 mb-8 transition-colors text-sm group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Volver al catalogo
      </Link>

      {/* Producto principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mb-16">
        {/* Imagen */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-amber-50 shadow-sm">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-8xl">🐱</div>
          )}
        </div>

        {/* Detalles */}
        <div className="flex flex-col">
          {/* Categoria */}
          <Link
            href={`/catalogo?categoria=${product.category.slug}`}
            className="inline-flex items-center gap-1.5 text-orange-500 hover:text-orange-600 text-sm font-medium mb-3 w-fit transition-colors"
          >
            <Tag size={14} />
            {product.category.name}
          </Link>

          {/* Nombre */}
          <h1 className="text-3xl font-bold text-stone-800 mb-4 leading-tight">
            {product.name}
          </h1>

          {/* Precio */}
          <p className="text-4xl font-bold text-orange-500 mb-6">
            {formatPrice(product.price)}
          </p>

          {/* Descripcion */}
          {product.description && (
            <p className="text-stone-600 leading-relaxed mb-8">
              {product.description}
            </p>
          )}

          {/* Stock */}
          <div className="flex items-center gap-2 mb-8 text-sm">
            <Package
              size={16}
              className={product.stock > 0 ? "text-green-500" : "text-red-400"}
            />
            {product.stock > 5 ? (
              <span className="text-green-600 font-medium">En stock ({product.stock} disponibles)</span>
            ) : product.stock > 0 ? (
              <span className="text-amber-600 font-medium">Quedan solo {product.stock} unidades</span>
            ) : (
              <span className="text-red-500 font-medium">Sin stock</span>
            )}
          </div>

          {/* Add to cart */}
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: firstImage ?? "",
              stock: product.stock,
            }}
          />
        </div>
      </div>

      {/* Productos relacionados */}
      {related.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-stone-800 mb-6">
            Otros productos de {product.category.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {related.map((p) => {
              const imgs = JSON.parse(p.images) as string[];
              return (
                <Link
                  key={p.id}
                  href={`/productos/${p.slug}`}
                  className="card group cursor-pointer"
                >
                  <div className="relative aspect-square overflow-hidden bg-amber-50">
                    {imgs[0] ? (
                      <Image
                        src={imgs[0]}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-4xl">🐱</div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-stone-500 line-clamp-2 mb-1">{p.name}</p>
                    <p className="font-bold text-stone-800">{formatPrice(p.price)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
