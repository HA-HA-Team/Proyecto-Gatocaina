import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Package, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Pedido confirmado" };

interface PageProps {
  searchParams: { orderId?: string };
}

export default async function ConfirmacionPage({ searchParams }: PageProps) {
  const { orderId } = searchParams;

  if (!orderId) redirect("/");

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: { product: true },
      },
      user: { select: { name: true, email: true } },
    },
  });

  if (!order) redirect("/");

  const shortId = order.id.slice(-8).toUpperCase();

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
          <CheckCircle2 size={44} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-bold text-stone-800 mb-2">
          Pedido confirmado
        </h1>
        <p className="text-stone-500">
          Gracias{order.user.name ? `, ${order.user.name.split(" ")[0]}` : ""}!
          Tu pedido esta siendo procesado.
        </p>
      </div>

      {/* Tarjeta resumen */}
      <div className="card p-6 mb-6">
        {/* Numero de pedido */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-amber-100">
          <div>
            <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">
              Numero de pedido
            </p>
            <p className="text-xl font-bold text-stone-800 font-mono">
              #{shortId}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Estado</p>
            <span className="badge bg-amber-100 text-amber-800 px-3 py-1">
              En proceso
            </span>
          </div>
        </div>

        {/* Productos del pedido */}
        <div className="space-y-3 mb-5">
          {order.items.map((item) => {
            const images = JSON.parse(item.product.images) as string[];
            return (
              <div key={item.id} className="flex gap-3 items-center">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-amber-50 shrink-0">
                  {images[0] ? (
                    <Image
                      src={images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-2xl">🐱</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 line-clamp-1">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-stone-400">
                    {item.quantity} ud. × {formatPrice(item.price)}
                  </p>
                </div>
                <p className="text-sm font-bold text-stone-700 shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-4 border-t border-amber-100">
          <div className="flex items-center gap-2 text-stone-500 text-sm">
            <Package size={16} />
            Envio gratuito
          </div>
          <div className="text-right">
            <p className="text-xs text-stone-400 mb-0.5">Total pagado</p>
            <p className="text-2xl font-bold text-orange-500">
              {formatPrice(order.total)}
            </p>
          </div>
        </div>
      </div>

      {/* Direccion */}
      {order.address && (
        <div className="card p-5 mb-8 text-sm text-stone-600">
          <p className="font-semibold text-stone-700 mb-1">Direccion de envio</p>
          <p>{order.address}</p>
        </div>
      )}

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/catalogo" className="btn-primary flex-1 justify-center py-3">
          Seguir comprando
          <ArrowRight size={18} />
        </Link>
        <Link href="/" className="btn-secondary flex-1 justify-center py-3">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
