"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Email invalido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setServerError("");

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setServerError("Email o contraseña incorrectos");
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="card p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🐱</div>
        <h1 className="text-2xl font-bold text-stone-800">Bienvenido de vuelta</h1>
        <p className="text-stone-500 text-sm mt-1">Inicia sesion en tu cuenta</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Error global */}
        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
            {serverError}
          </div>
        )}

        {/* Email */}
        <div>
          <label htmlFor="email" className="label">
            Email
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            className="input-field"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Contraseña */}
        <div>
          <label htmlFor="password" className="label">
            Contraseña
          </label>
          <input
            {...register("password")}
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="input-field"
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center py-3 mt-2"
        >
          {loading ? "Iniciando sesion..." : "Iniciar Sesion"}
        </button>
      </form>

      <p className="text-center text-sm text-stone-500 mt-6">
        ¿No tienes cuenta?{" "}
        <Link
          href="/register"
          className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
        >
          Registrate gratis
        </Link>
      </p>
    </div>
  );
}
