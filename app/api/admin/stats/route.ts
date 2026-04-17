import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const [totalProducts, activeProducts, totalOrders, totalUsers, revenueData, recentOrders] =
    await Promise.all([
      db.product.count(),
      db.product.count({ where: { isActive: true } }),
      db.order.count(),
      db.user.count(),
      db.order.aggregate({ _sum: { total: true } }),
      db.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          items: { include: { product: { select: { name: true } } } },
        },
      }),
    ]);

  return NextResponse.json({
    totalProducts,
    activeProducts,
    totalOrders,
    totalUsers,
    revenue: revenueData._sum.total ?? 0,
    recentOrders,
  });
}
