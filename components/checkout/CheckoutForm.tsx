"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, Lock, MapPin, User, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

const checkoutSchema = z.object({
  name: z.string().min(2, "Minimo 2 caracteres"),
  email: z.string().email("Email invalido"),
  phone: z.string().min(9, "Minimo 9 caracteres"),
  address: z.string().min(5, "Ingresa tu direccion completa"),
  city: z.string().min(2, "Ingresa tu ciudad"),
  zipCode: z.string().min(4, "Codigo postal invalido"),
  cardName: z.string().min(2, "Nombre en tarjeta requerido"),
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, "Introduce 16 digitos sin espacios"),
  cardExpiry: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, "Formato MM/AA"),
  cardCvv: z
    .string()
    .regex(/^\d{3,4}$/, "3 o 4 digitos"),
});

type CheckoutData = z.infer<typeof checkoutSchema>;

interface Props {
  user: { name?: string | null; email?: string | null };
}

export function CheckoutForm({ user }: Props) {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => setMounted(true), []);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user.name ?? "",
      email: user.email ?? "",
    },
  });

  const onSubmit = async (data: CheckoutData) => {
    if (items.length === 0) return;
    setLoading(true);
    setServerError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          zipCode: data.zipCode,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setServerError(json.error ?? "Error al procesar el pedido");
        return;
      }

      const { orderId } = await res.json();
      clearCart();
      router.push(`/checkout/confirmacion?orderId=${orderId}`);
    } catch {
      setServerError("Error de conexion. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return <div className="h-96 bg-stone-100 rounded-2xl animate-pulse" />;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🛒</div>
        <p className="text-stone-500 mb-6">Tu carrito esta vacio</p>
        <Link href="/catalogo" className="btn-primary">
          Ver catalogo
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      {/* ── Columna izquierda: formularios ── */}
      <div className="lg:col-span-2 space-y-6">
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {serverError}
          </div>
        )}

        {/* Datos personales */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-stone-800 mb-5 flex items-center gap-2">
            <User size={18} className="text-orange-500" />
            Datos de contacto
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Nombre completo</label>
              <input
                {...register("name")}
                type="text"
                placeholder="Juan Garcia"
                className="input-field"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="label">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="tu@email.com"
                className="input-field"
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="label">Telefono</label>
              <input
                {...register("phone")}
                type="tel"
                placeholder="612 345 678"
                className="input-field"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Direccion de envio */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-stone-800 mb-5 flex items-center gap-2">
            <MapPin size={18} className="text-orange-500" />
            Direccion de envio
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Direccion</label>
              <input
                {...register("address")}
                type="text"
                placeholder="Calle Mayor 123, Piso 2B"
                className="input-field"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
              )}
            </div>
            <div>
              <label className="label">Ciudad</label>
              <input
                {...register("city")}
                type="text"
                placeholder="Madrid"
                className="input-field"
              />
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>
              )}
            </div>
            <div>
              <label className="label">Codigo postal</label>
              <input
                {...register("zipCode")}
                type="text"
                placeholder="28001"
                className="input-field"
              />
              {errors.zipCode && (
                <p className="text-red-500 text-xs mt-1">{errors.zipCode.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Pago simulado */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-stone-800 mb-2 flex items-center gap-2">
            <CreditCard size={18} className="text-orange-500" />
            Informacion de pago
          </h2>

          <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-5 text-sm text-amber-800 flex items-center gap-2">
            🧪 <span><strong>Modo demo:</strong> usa cualquier numero. No se realiza ningun cargo real.</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label">Nombre en la tarjeta</label>
              <input
                {...register("cardName")}
                type="text"
                placeholder="JUAN GARCIA"
                className="input-field uppercase"
              />
              {errors.cardName && (
                <p className="text-red-500 text-xs mt-1">{errors.cardName.message}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="label">Numero de tarjeta (16 digitos)</label>
              <input
                {...register("cardNumber")}
                type="text"
                placeholder="4111111111111111"
                maxLength={16}
                className="input-field font-mono tracking-widest"
              />
              {errors.cardNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.cardNumber.message}</p>
              )}
            </div>
            <div>
              <label className="label">Fecha de caducidad</label>
              <input
                {...register("cardExpiry")}
                type="text"
                placeholder="12/27"
                maxLength={5}
                className="input-field font-mono"
              />
              {errors.cardExpiry && (
                <p className="text-red-500 text-xs mt-1">{errors.cardExpiry.message}</p>
              )}
            </div>
            <div>
              <label className="label">CVV</label>
              <input
                {...register("cardCvv")}
                type="text"
                placeholder="123"
                maxLength={4}
                className="input-field font-mono"
              />
              {errors.cardCvv && (
                <p className="text-red-500 text-xs mt-1">{errors.cardCvv.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Boton confirmar */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-4 text-base"
        >
          <Lock size={18} />
          {loading ? "Procesando pedido..." : `Confirmar pedido · ${formatPrice(subtotal)}`}
        </button>
      </div>

      {/* ── Columna derecha: resumen ── */}
      <div>
        <div className="card p-6 sticky top-24">
          <h2 className="text-lg font-bold text-stone-800 mb-5 flex items-center gap-2">
            <ShoppingBag size={18} className="text-orange-500" />
            Tu pedido
          </h2>

          <div className="space-y-3 mb-5 max-h-72 overflow-y-auto">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3 items-center">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-amber-50 shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xl">🐱</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-stone-700 line-clamp-1">
                    {item.name}
                  </p>
                  <p className="text-xs text-stone-400">x{item.quantity}</p>
                </div>
                <p className="text-sm font-bold text-stone-700 shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-amber-100 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-stone-500">
              <span>{totalItems} {totalItems === 1 ? "articulo" : "articulos"}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-stone-500">
              <span>Envio</span>
              <span className="text-green-600 font-medium">Gratis</span>
            </div>
            <div className="flex justify-between font-bold text-stone-800 text-lg pt-2 border-t border-amber-100">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
