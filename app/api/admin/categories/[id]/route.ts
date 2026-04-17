import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const data = updateSchema.parse(body);

    const updateData: Record<string, unknown> = { ...data };

    if (data.name) {
      const newSlug = slugify(data.name);
      const existing = await db.category.findFirst({
        where: { slug: newSlug, NOT: { id: params.id } },
      });
      if (existing) {
        return NextResponse.json({ error: "Ya existe una categoría con ese nombre" }, { status: 400 });
      }
      updateData.slug = newSlug;
    }

    const category = await db.category.update({
      where: { id: params.id },
      data: updateData,
      include: { _count: { select: { products: true } } },
    });

    return NextResponse.json(category);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al actualizar categoría" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const productCount = await db.product.count({ where: { categoryId: params.id } });
    if (productCount > 0) {
      return NextResponse.json(
        { error: `No se puede eliminar: tiene ${productCount} producto(s) asociado(s)` },
        { status: 400 }
      );
    }

    await db.category.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error al eliminar categoría" }, { status: 500 });
  }
}
