import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoria = searchParams.get("categoria");
    const q = searchParams.get("q");

    const products = await db.product.findMany({
      where: {
        isActive: true,
        ...(categoria ? { category: { slug: categoria } } : {}),
        ...(q
          ? { name: { contains: q } }
          : {}),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}
