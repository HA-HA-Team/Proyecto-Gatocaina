import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Package, ArrowRight, ShoppingBag } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mis pedidos" };

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  PROCESSING: "En proceso",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  PROCESSING: "bg-blue-50 text-blue-700 border-blue-200",
  SHIPPED: "bg-purple-50 text-purple-700 border-purple-200",
  DELIVERED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-500 border-red-200",
};

export default async function MisPedidosPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { product: { select: { name: true, images: true, slug: true } } },
      },
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-stone-900 mb-1">Mis pedidos</h1>
        <p className="text-stone-500">
          {orders.length === 0
            ? "Aún no has realizado ningún pedido"
            : `${orders.length} pedido${orders.length !== 1 ? "s" : ""} en total`}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-stone-100 shadow-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-50 rounded-full mb-6">
            <ShoppingBag size={32} className="text-orange-400" />
          </div>
          <h2 className="text-xl font-semibold text-stone-800 mb-3">
            Todavía no hay pedidos
          </h2>
          <p className="text-stone-400 mb-8 max-w-sm mx-auto">
            Cuando realices tu primera compra, podrás ver el estado aquí.
          </p>
          <Link href="/catalogo" className="btn-primary px-8 py-3 text-base">
            Explorar catálogo
            <ArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const firstImages = order.items.slice(0, 3).map((item) => {
              const imgs = JSON.parse(item.product.images) as string[];
              return { src: imgs[0] ?? null, name: item.product.name };
            });

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden"
              >
                {/* Header del pedido */}
                <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 border-b border-stone-50">
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-0.5">Pedido</p>
                      <p className="font-mono text-stone-600 font-semibold">
                        #{order.id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-0.5">Fecha</p>
                      <p className="text-stone-600 font-medium">
                        {new Date(order.createdAt).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-stone-400 font-medium uppercase tracking-wide mb-0.5">Total</p>
                      <p className="text-stone-800 font-bold">{formatPrice(order.total)}</p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                      STATUS_COLORS[order.status] ?? "bg-stone-100 text-stone-600 border-stone-200"
                    }`}
                  >
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </div>

                {/* Productos del pedido */}
                <div className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    {/* Miniaturas */}
                    <div className="flex -space-x-2">
                      {firstImages.map((img, i) => (
                        <div
                          key={i}
                          className="w-12 h-12 rounded-xl overflow-hidden bg-stone-100 border-2 border-white shadow-sm"
                        >
                          {img.src ? (
                            <Image
                              src={img.src}
                              alt={img.name}
                              width={48}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-xl">🐱</div>
                          )}
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-12 h-12 rounded-xl bg-stone-100 border-2 border-white shadow-sm flex items-center justify-center text-xs font-semibold text-stone-500">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>

                    {/* Descripción de ítems */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-stone-700 font-medium line-clamp-1">
                        {order.items.map((i) => i.product.name).join(", ")}
                      </p>
                      <p className="text-xs text-stone-400 mt-0.5">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} artículo(s)
                      </p>
                    </div>

                    {/* Dirección */}
                    {order.address && (
                      <div className="hidden md:flex items-start gap-2 text-xs text-stone-400 max-w-xs">
                        <Package size={13} className="mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{order.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link href="/catalogo" className="text-sm text-stone-400 hover:text-orange-500 transition-colors">
          ← Volver al catálogo
        </Link>
      </div>
    </div>
  );
}
