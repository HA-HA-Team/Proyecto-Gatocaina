import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  images: z.array(z.string().url()).default([]),
  isActive: z.boolean().default(true),
  categoryId: z.string().min(1),
});

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const products = await db.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    products.map((p) => ({ ...p, images: JSON.parse(p.images) }))
  );
}

export async function POST(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const body = await request.json();
    const data = productSchema.parse(body);

    const slug = slugify(data.name);
    const existing = await db.product.findUnique({ where: { slug } });
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

    const product = await db.product.create({
      data: {
        ...data,
        slug: finalSlug,
        images: JSON.stringify(data.images),
      },
      include: { category: true },
    });

    return NextResponse.json({ ...product, images: JSON.parse(product.images) }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al crear producto" }, { status: 500 });
  }
}
