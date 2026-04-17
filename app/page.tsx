import Link from "next/link";
import { ArrowRight, Truck, Shield, Star, Heart } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pelusas Tienda Animal | Donde los bigotes mandan",
};

const categories = [
  {
    emoji: "🥣",
    title: "Comida Premium",
    desc: "Nutrición de alta calidad formulada para felinos exigentes",
    href: "/catalogo?categoria=comida",
    bg: "from-orange-50 to-amber-50",
    accent: "text-orange-500",
  },
  {
    emoji: "🧶",
    title: "Juguetes",
    desc: "Diversión e instinto cazador estimulado al máximo",
    href: "/catalogo?categoria=juguetes",
    bg: "from-purple-50 to-pink-50",
    accent: "text-purple-500",
  },
  {
    emoji: "🏠",
    title: "Accesorios",
    desc: "Comodidad y estilo para el rincón favorito de tu gato",
    href: "/catalogo?categoria=accesorios",
    bg: "from-teal-50 to-cyan-50",
    accent: "text-teal-500",
  },
];

const perks = [
  { icon: Truck, label: "Envío gratis", desc: "En todos los pedidos" },
  { icon: Shield, label: "Calidad garantizada", desc: "Productos seleccionados" },
  { icon: Star, label: "Los mejores productos", desc: "Para tu felino" },
  { icon: Heart, label: "Hecho con amor", desc: "Por amantes de los gatos" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-amber-50 to-[#f7f4f0]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-200/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-orange-100 rounded-full px-4 py-2 text-sm font-semibold text-orange-600 mb-8 shadow-sm">
              <span className="text-base">🐱</span>
              Todo para tu felino favorito
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-stone-900 mb-6 leading-[1.05]">
              Donde los
              <span className="block text-orange-500">bigotes</span>
              mandan
            </h1>

            <p className="text-lg md:text-xl text-stone-500 mb-10 leading-relaxed max-w-lg">
              Comida, juguetes y accesorios premium para el felino
              que domina tu corazón y tu sofá.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/catalogo" className="btn-primary text-base px-8 py-3.5">
                Ver catálogo
                <ArrowRight size={18} />
              </Link>
              <Link href="/register" className="btn-secondary text-base px-8 py-3.5">
                Crear cuenta gratis
              </Link>
            </div>
          </div>

          {/* Decorative cat */}
          <div className="absolute right-8 bottom-0 hidden lg:block text-[180px] leading-none select-none opacity-80">
            🐈
          </div>
        </div>
      </section>

      {/* Perks strip */}
      <section className="bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {perks.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg shrink-0">
                  <Icon size={16} className="text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-stone-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="section-title text-3xl md:text-4xl mb-3">
            Encuentra lo que necesitas
          </h2>
          <p className="text-stone-500 text-lg max-w-md mx-auto">
            Seleccionamos cada producto pensando en el bienestar de tu gato
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${cat.bg} p-8 border border-white/60 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300">
                {cat.emoji}
              </div>
              <h3 className={`text-xl font-bold mb-2 ${cat.accent}`}>{cat.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{cat.desc}</p>
              <div className={`mt-5 flex items-center gap-1.5 text-sm font-semibold ${cat.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                Ver productos <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-stone-900 rounded-3xl px-8 py-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/30 via-stone-900 to-stone-900" />
          <div className="relative">
            <p className="text-5xl mb-6">🐾</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tu gato se lo merece todo
            </h2>
            <p className="text-stone-400 mb-8 max-w-sm mx-auto">
              Más de 50 productos cuidadosamente seleccionados para el bienestar felino
            </p>
            <Link href="/catalogo" className="btn-primary text-base px-8 py-3.5 bg-orange-500 hover:bg-orange-400">
              Explorar catálogo completo
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
