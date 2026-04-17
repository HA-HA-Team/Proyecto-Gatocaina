import { db } from "@/lib/db";
import { OrdersTable } from "@/components/admin/OrdersTable";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Pedidos" };

export default async function AdminPedidosPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: { product: { select: { name: true } } },
      },
    },
  });

  const serialized = orders.map((o) => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  }));

  return (
    <div className="p-8">
      <OrdersTable initialOrders={serialized} />
    </div>
  );
}
