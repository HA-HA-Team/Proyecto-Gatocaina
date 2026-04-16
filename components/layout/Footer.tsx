import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-stone-800 text-stone-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🐱</span>
              <span className="text-xl font-bold text-white">
                Pelusas <span className="text-orange-400">Tienda Animal</span>
              </span>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed max-w-xs">
              Tu tienda de confianza para todo lo que tu gato necesita.
              Calidad, amor y mimos en cada producto.
            </p>
          </div>

          {/* Tienda */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Tienda
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/catalogo", label: "Catalogo completo" },
                { href: "/catalogo?categoria=comida", label: "Comida" },
                { href: "/catalogo?categoria=juguetes", label: "Juguetes" },
                { href: "/catalogo?categoria=accesorios", label: "Accesorios" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-orange-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cuenta */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Mi Cuenta
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { href: "/login", label: "Iniciar Sesion" },
                { href: "/register", label: "Registrarse" },
                { href: "/carrito", label: "Mi Carrito" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-orange-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-700 mt-10 pt-8 text-center text-sm text-stone-500">
          <p>
            &copy; {year} Pelusas tienda Animal. Hecho con{" "}
            <span className="text-orange-400">&#9829;</span> para los amantes
            de los gatos.
          </p>
        </div>
      </div>
    </footer>
  );
}
