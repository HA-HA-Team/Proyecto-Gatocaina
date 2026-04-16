import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-1">Finalizar compra</h1>
        <p className="text-stone-500">Completa tus datos para confirmar el pedido</p>
      </div>

      <CheckoutForm
        user={{
          name: session.user.name,
          email: session.user.email,
        }}
      />
    </div>
  );
}
