import { db } from "@/lib/db";
import { CategoriesTable } from "@/components/admin/CategoriesTable";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Categorías" };

export default async function AdminCategoriasPage() {
  const categories = await db.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="p-8">
      <CategoriesTable initialCategories={categories} />
    </div>
  );
}
