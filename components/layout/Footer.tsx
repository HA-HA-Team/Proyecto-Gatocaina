import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-stone-950 text-stone-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5 group w-fit">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🐱</span>
              <span className="text-lg font-bold text-white">
                Pelusas <span className="text-orange-400">Tienda Animal</span>
              </span>
            </Link>
            <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
              Tu tienda de confianza para todo lo que tu gato necesita.
              Calidad, amor y mimos en cada producto.
            </p>
            <p className="mt-5 text-xs text-stone-600 italic">
              &ldquo;Donde los bigotes mandan&rdquo;
            </p>
          </div>

          {/* Tienda */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-xs uppercase tracking-widest">
              Tienda
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/catalogo", label: "Catálogo completo" },
                { href: "/catalogo?categoria=comida", label: "Comida" },
                { href: "/catalogo?categoria=juguetes", label: "Juguetes" },
                { href: "/catalogo?categoria=accesorios", label: "Accesorios" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-orange-400 transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cuenta */}
          <div>
            <h3 className="text-white font-semibold mb-5 text-xs uppercase tracking-widest">
              Mi Cuenta
            </h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: "/login", label: "Iniciar sesión" },
                { href: "/register", label: "Registrarse" },
                { href: "/carrito", label: "Mi carrito" },
                { href: "/mis-pedidos", label: "Mis pedidos" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-orange-400 transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-stone-600">
            &copy; {year} Pelusas Tienda Animal. Todos los derechos reservados.
          </p>
          <p className="text-xs text-stone-700">
            Hecho con <span className="text-orange-500">&#9829;</span> para los amantes de los gatos
          </p>
        </div>
      </div>
    </footer>
  );
}
