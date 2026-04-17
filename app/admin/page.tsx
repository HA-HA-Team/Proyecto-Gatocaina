import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingBag, Users, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  PROCESSING: "En proceso",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export default async function AdminDashboardPage() {
  const [totalProducts, activeProducts, totalOrders, totalUsers, revenueData, recentOrders] =
    await Promise.all([
      db.product.count(),
      db.product.count({ where: { isActive: true } }),
      db.order.count(),
      db.user.count(),
      db.order.aggregate({ _sum: { total: true } }),
      db.order.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          items: true,
        },
      }),
    ]);

  const revenue = revenueData._sum.total ?? 0;

  const stats = [
    {
      label: "Productos activos",
      value: `${activeProducts} / ${totalProducts}`,
      icon: Package,
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Pedidos totales",
      value: totalOrders,
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Usuarios registrados",
      value: totalUsers,
      icon: Users,
      color: "bg-purple-50 text-purple-600",
    },
    {
      label: "Ingresos totales",
      value: formatPrice(revenue),
      icon: TrendingUp,
      color: "bg-green-50 text-green-600",
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-stone-800 mb-1">Dashboard</h1>
      <p className="text-stone-500 text-sm mb-8">Resumen general de la tienda</p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-stone-200 p-5">
            <div className={`inline-flex p-2.5 rounded-lg ${color} mb-3`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-stone-800">{value}</p>
            <p className="text-xs text-stone-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-stone-200">
        <div className="px-6 py-4 border-b border-stone-100">
          <h2 className="font-semibold text-stone-800">Pedidos recientes</h2>
        </div>
        <div className="divide-y divide-stone-100">
          {recentOrders.length === 0 ? (
            <p className="text-center text-stone-400 py-10 text-sm">No hay pedidos aún</p>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-stone-800">
                    {order.user.name ?? order.user.email}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {order.items.length} producto(s) ·{" "}
                    {new Date(order.createdAt).toLocaleDateString("es-ES")}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      STATUS_COLORS[order.status] ?? "bg-stone-100 text-stone-600"
                    }`}
                  >
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                  <span className="text-sm font-semibold text-stone-700">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
