import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

const img = (seed: string) => `https://picsum.photos/seed/${seed}/600/600`;

async function main() {
  console.log("Limpiando base de datos...");
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.product.deleteMany();
  await db.category.deleteMany();

  console.log("Creando categorias...");
  const [comida, juguetes, accesorios, salud, higiene] = await Promise.all([
    db.category.create({
      data: {
        name: "Comida",
        slug: "comida",
        description: "Alimentacion de calidad para tu gato",
        image: img("cat-food-category"),
      },
    }),
    db.category.create({
      data: {
        name: "Juguetes",
        slug: "juguetes",
        description: "Diversión y entretenimiento felino",
        image: img("cat-toy-category"),
      },
    }),
    db.category.create({
      data: {
        name: "Accesorios",
        slug: "accesorios",
        description: "Comodidad y estilo para tu gato",
        image: img("cat-acc-category"),
      },
    }),
    db.category.create({
      data: {
        name: "Salud",
        slug: "salud",
        description: "Productos para el bienestar de tu gato",
        image: img("cat-health-category"),
      },
    }),
    db.category.create({
      data: {
        name: "Higiene",
        slug: "higiene",
        description: "Limpieza y cuidado personal",
        image: img("cat-hygiene-category"),
      },
    }),
  ]);

  console.log("Creando productos...");
  await db.product.createMany({
    data: [
      // --- COMIDA ---
      {
        name: "Pienso Premium para Gatos Adultos 3kg",
        slug: "pienso-premium-adultos-3kg",
        description:
          "Formula balanceada con pollo y salmon. Enriquecida con taurina y omega-3 para una salud optima. Sin colorantes ni conservantes artificiales.",
        price: 18.99,
        stock: 45,
        images: JSON.stringify([img("cat-kibble-1"), img("cat-kibble-2")]),
        categoryId: comida.id,
      },
      {
        name: "Pate de Pollo para Gatos x12 latas",
        slug: "pate-pollo-gatos-x12",
        description:
          "Pate humedo de pollo con vitaminas y minerales esenciales. Pack de 12 latas de 85g. Ideal como complemento a la dieta seca.",
        price: 14.5,
        stock: 30,
        images: JSON.stringify([img("cat-pate-1"), img("cat-pate-2")]),
        categoryId: comida.id,
      },
      {
        name: "Snacks de Salmon Liofilizado 50g",
        slug: "snacks-salmon-liofilizado-50g",
        description:
          "Premios 100% naturales de salmon liofilizado. Sin aditivos ni conservantes. Irresistibles para cualquier gato.",
        price: 6.99,
        stock: 80,
        images: JSON.stringify([img("cat-treats-1")]),
        categoryId: comida.id,
      },
      {
        name: "Comida Seca para Kitten 1.5kg",
        slug: "comida-seca-kitten-15kg",
        description:
          "Formula especial para gatitos de 2 a 12 meses. Alto contenido en proteinas para un crecimiento sano y fuerte.",
        price: 12.99,
        stock: 25,
        images: JSON.stringify([img("kitten-food-1")]),
        categoryId: comida.id,
      },

      // --- JUGUETES ---
      {
        name: "Varita Interactiva con Plumas",
        slug: "varita-interactiva-plumas",
        description:
          "Varita de 60cm con plumas coloridas intercambiables. Estimula el instinto cazador. Incluye 3 accesorios distintos.",
        price: 8.99,
        stock: 60,
        images: JSON.stringify([img("cat-wand-1"), img("cat-wand-2")]),
        categoryId: juguetes.id,
      },
      {
        name: "Raton de Peluche con Catnip",
        slug: "raton-peluche-catnip",
        description:
          "Raton de peluche relleno de catnip natural. Textura atractiva que incita al juego. Tamaño perfecto para zarpazo y mordisco.",
        price: 4.99,
        stock: 100,
        images: JSON.stringify([img("cat-mouse-toy")]),
        categoryId: juguetes.id,
      },
      {
        name: "Torre de Actividades 5 Niveles",
        slug: "torre-actividades-5-niveles",
        description:
          "Torre de juego con bolas, plumas y campanas en 5 niveles. Mantiene a tu gato entretenido durante horas. Facil de montar.",
        price: 29.99,
        stock: 15,
        images: JSON.stringify([img("cat-tower-1"), img("cat-tower-2")]),
        categoryId: juguetes.id,
      },
      {
        name: "Puntero Laser Automatico",
        slug: "puntero-laser-automatico",
        description:
          "Laser rotatorio automatico con 3 velocidades y apagado automatico. Funciona con pilas AAA. Seguro para los ojos del gato.",
        price: 12.99,
        stock: 35,
        images: JSON.stringify([img("cat-laser-1")]),
        categoryId: juguetes.id,
      },

      // --- ACCESORIOS ---
      {
        name: "Cama Donut Acolchada Antideslizante",
        slug: "cama-donut-acolchada",
        description:
          "Cama circular super suave con bordes elevados. Material acolchado lavable a maquina. Base antideslizante. Talla M (50cm).",
        price: 34.99,
        stock: 20,
        images: JSON.stringify([img("cat-bed-donut"), img("cat-bed-donut-2")]),
        categoryId: accesorios.id,
      },
      {
        name: "Comedero Doble de Ceramica",
        slug: "comedero-doble-ceramica",
        description:
          "Set de dos cuencos de ceramica premium con soporte de madera elevado. Disenado para reducir la tension en el cuello. Apto para lavavajillas.",
        price: 22.99,
        stock: 28,
        images: JSON.stringify([img("cat-bowl-ceramic")]),
        categoryId: accesorios.id,
      },
      {
        name: "Transportin Rigido Deluxe M",
        slug: "transportin-rigido-deluxe-m",
        description:
          "Transportin de plastico rigido con puerta de seguridad. Ventilacion optima. Facil limpieza. Medidas: 48x32x32cm.",
        price: 49.99,
        stock: 10,
        images: JSON.stringify([img("cat-carrier-1")]),
        categoryId: accesorios.id,
      },
      {
        name: "Rascador Sisal Natural 60cm",
        slug: "rascador-sisal-natural-60cm",
        description:
          "Rascador de cuerda de sisal natural con base estable. Protege tus muebles y cuida las unas de tu gato. Incluye juguete colgante.",
        price: 19.99,
        stock: 40,
        images: JSON.stringify([img("cat-scratcher-sisal")]),
        categoryId: accesorios.id,
      },

      // --- SALUD ---
      {
        name: "Vitaminas Omega 3 y 6 para Gatos",
        slug: "vitaminas-omega-3-6-gatos",
        description:
          "Suplemento diario de omega 3 y 6 en formato gel. Mejora el pelaje y la piel. Sabor a salmon que encanta a los gatos. 100ml.",
        price: 14.99,
        stock: 50,
        images: JSON.stringify([img("cat-vitamins-1")]),
        categoryId: salud.id,
      },
      {
        name: "Antiparasitario Mensual Spot-On",
        slug: "antiparasitario-mensual-spot-on",
        description:
          "Proteccion completa contra pulgas, garrapatas y mosquitos. Aplicacion topica mensual. Para gatos de mas de 1kg. Caja de 3 pipetas.",
        price: 22.5,
        stock: 35,
        images: JSON.stringify([img("cat-antiparasitic")]),
        categoryId: salud.id,
      },

      // --- HIGIENE ---
      {
        name: "Arena Aglomerante Premium 5kg",
        slug: "arena-aglomerante-premium-5kg",
        description:
          "Arena de bentonita de alta absorcion con control de olores. Forma grumos solidos para una limpieza facil. Sin polvo. 5kg.",
        price: 11.99,
        stock: 60,
        images: JSON.stringify([img("cat-litter-1")]),
        categoryId: higiene.id,
      },
      {
        name: "Cepillo Masajeador de Silicona",
        slug: "cepillo-masajeador-silicona",
        description:
          "Cepillo de silicona suave con puntas masajeadoras. Elimina el pelo muerto y estimula la circulacion. Tu gato lo adorara.",
        price: 9.99,
        stock: 55,
        images: JSON.stringify([img("cat-brush-1")]),
        categoryId: higiene.id,
      },
    ],
  });

  console.log("Creando usuario admin...");
  const hashedPassword = await bcrypt.hash("admin123", 12);
  await db.user.upsert({
    where: { email: "admin@gatocaina.com" },
    update: {},
    create: {
      name: "Admin Gatocaina",
      email: "admin@gatocaina.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`
✅ Seed completado:
   - 5 categorias
   - 16 productos
   - 1 usuario admin (admin@gatocaina.com / admin123)
  `);
}

main()
  .catch((e) => {
    console.error("Error en seed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
