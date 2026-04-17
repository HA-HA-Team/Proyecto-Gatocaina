import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional().nullable(),
  price: z.number().positive().optional(),
  stock: z.number().int().min(0).optional(),
  images: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  categoryId: z.string().min(1).optional(),
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
      const existing = await db.product.findFirst({
        where: { slug: newSlug, NOT: { id: params.id } },
      });
      updateData.slug = existing ? `${newSlug}-${Date.now()}` : newSlug;
    }

    if (data.images !== undefined) {
      updateData.images = JSON.stringify(data.images);
    }

    const product = await db.product.update({
      where: { id: params.id },
      data: updateData,
      include: { category: true },
    });

    return NextResponse.json({ ...product, images: JSON.parse(product.images) });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    await db.product.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error al eliminar producto" }, { status: 500 });
  }
}
