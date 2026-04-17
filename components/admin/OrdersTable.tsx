"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pendiente" },
  { value: "PROCESSING", label: "En proceso" },
  { value: "SHIPPED", label: "Enviado" },
  { value: "DELIVERED", label: "Entregado" },
  { value: "CANCELLED", label: "Cancelado" },
];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { name: string };
}

interface Order {
  id: string;
  total: number;
  status: string;
  address: string | null;
  createdAt: string;
  user: { name: string | null; email: string };
  items: OrderItem[];
}

interface OrdersTableProps {
  initialOrders: Order[];
}

export function OrdersTable({ initialOrders }: OrdersTableProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [updating, setUpdating] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function handleStatusChange(orderId: string, status: string) {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status } : o))
        );
      }
    } finally {
      setUpdating(null);
    }
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Pedidos</h1>
        <p className="text-stone-500 text-sm">{orders.length} pedido(s)</p>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="text-left px-5 py-3 text-stone-600 font-medium">ID</th>
              <th className="text-left px-5 py-3 text-stone-600 font-medium">Cliente</th>
              <th className="text-left px-5 py-3 text-stone-600 font-medium">Fecha</th>
              <th className="text-right px-5 py-3 text-stone-600 font-medium">Total</th>
              <th className="text-center px-5 py-3 text-stone-600 font-medium">Estado</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-stone-400">
                  No hay pedidos todavía
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <>
                  <tr
                    key={order.id}
                    className="hover:bg-stone-50 transition-colors cursor-pointer"
                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  >
                    <td className="px-5 py-3.5 font-mono text-xs text-stone-400">
                      ...{order.id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-stone-800">{order.user.name ?? "—"}</p>
                      <p className="text-xs text-stone-400">{order.user.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-stone-500">
                      {new Date(order.createdAt).toLocaleDateString("es-ES", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-stone-700">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={updating === order.id}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-300 disabled:opacity-60 ${
                          STATUS_COLORS[order.status] ?? "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3.5">
                      <ChevronDown
                        size={15}
                        className={`text-stone-400 transition-transform mx-auto ${
                          expanded === order.id ? "rotate-180" : ""
                        }`}
                      />
                    </td>
                  </tr>

                  {expanded === order.id && (
                    <tr key={`${order.id}-detail`}>
                      <td colSpan={6} className="bg-stone-50 px-5 py-4">
                        <div className="grid grid-cols-2 gap-6">
                          <div>
                            <p className="text-xs font-semibold text-stone-500 uppercase mb-2">
                              Productos
                            </p>
                            <ul className="space-y-1">
                              {order.items.map((item) => (
                                <li key={item.id} className="flex justify-between text-sm text-stone-700">
                                  <span>
                                    {item.product.name}{" "}
                                    <span className="text-stone-400">x{item.quantity}</span>
                                  </span>
                                  <span>{formatPrice(item.price * item.quantity)}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-stone-500 uppercase mb-2">
                              Dirección de envío
                            </p>
                            <p className="text-sm text-stone-700 whitespace-pre-line">
                              {order.address ?? "No especificada"}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
