import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      {/* Hero */}
      <div className="text-8xl mb-6 animate-bounce">🐱</div>

      <h1 className="text-5xl md:text-7xl font-bold text-stone-800 mb-4 tracking-tight">
        Gato{" "}
        <span className="text-orange-500">Caina</span>
      </h1>

      <p className="text-xl text-stone-500 mb-10 max-w-lg leading-relaxed">
        La tienda online con todo lo que tu gato necesita.
        Comida, juguetes, accesorios y mucho amor felino.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/catalogo" className="btn-primary text-base px-8 py-3">
          Ver Catalogo
        </Link>
        <Link href="/register" className="btn-secondary text-base px-8 py-3">
          Crear Cuenta
        </Link>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-3xl w-full">
        {[
          { icon: "🥣", title: "Comida Premium", desc: "Alimentacion de alta calidad para tu felino" },
          { icon: "🧶", title: "Juguetes", desc: "Horas de diversion y entretenimiento" },
          { icon: "🏠", title: "Accesorios", desc: "Todo para que tu gato este comodo" },
        ].map((item) => (
          <div key={item.title} className="card p-6 text-center">
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="font-semibold text-stone-800 mb-2">{item.title}</h3>
            <p className="text-sm text-stone-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
