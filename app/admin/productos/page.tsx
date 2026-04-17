import { db } from "@/lib/db";
import { ProductsTable } from "@/components/admin/ProductsTable";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Productos" };

export default async function AdminProductosPage() {
  const [products, categories] = await Promise.all([
    db.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const serialized = products.map((p) => ({
    ...p,
    images: JSON.parse(p.images) as string[],
  }));

  return (
    <div className="p-8">
      <ProductsTable initialProducts={serialized} categories={categories} />
    </div>
  );
}
