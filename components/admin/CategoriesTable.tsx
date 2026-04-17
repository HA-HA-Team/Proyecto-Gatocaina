"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count: { products: number };
}

interface CategoriesTableProps {
  initialCategories: Category[];
}

const EMPTY_FORM = { name: "", description: "", image: "" };

export function CategoriesTable({ initialCategories }: CategoriesTableProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError("");
    setModalOpen(true);
  }

  function openEdit(category: Category) {
    setEditing(category);
    setForm({
      name: category.name,
      description: category.description ?? "",
      image: category.image ?? "",
    });
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      name: form.name,
      description: form.description || undefined,
      image: form.image || undefined,
    };

    try {
      const res = await fetch(
        editing ? `/api/admin/categories/${editing.id}` : "/api/admin/categories",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Error al guardar");
        return;
      }

      if (editing) {
        setCategories((prev) => prev.map((c) => (c.id === data.id ? data : c)));
      } else {
        setCategories((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      }
      setModalOpen(false);
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(category: Category) {
    if (category._count.products > 0) {
      alert(`No se puede eliminar: tiene ${category._count.products} producto(s) asociado(s).`);
      return;
    }
    if (!confirm(`¿Eliminar la categoría "${category.name}"?`)) return;
    setDeleting(category.id);
    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== category.id));
      } else {
        alert(data.error ?? "Error al eliminar");
      }
    } finally {
      setDeleting(null);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Categorías</h1>
          <p className="text-stone-500 text-sm">{categories.length} categoría(s)</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} />
          Nueva categoría
        </button>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="text-left px-5 py-3 text-stone-600 font-medium">Nombre</th>
              <th className="text-left px-5 py-3 text-stone-600 font-medium">Slug</th>
              <th className="text-left px-5 py-3 text-stone-600 font-medium">Descripción</th>
              <th className="text-right px-5 py-3 text-stone-600 font-medium">Productos</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-stone-400">
                  No hay categorías. Crea la primera.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-stone-800">{cat.name}</td>
                  <td className="px-5 py-3.5 text-stone-400 font-mono text-xs">{cat.slug}</td>
                  <td className="px-5 py-3.5 text-stone-500 max-w-xs truncate">
                    {cat.description ?? "—"}
                  </td>
                  <td className="px-5 py-3.5 text-right text-stone-700">{cat._count.products}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(cat)}
                        className="p-1.5 text-stone-400 hover:text-orange-500 transition-colors"
                        title="Editar"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        disabled={deleting === cat.id}
                        className="p-1.5 text-stone-400 hover:text-red-500 transition-colors disabled:opacity-40"
                        title="Eliminar"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
              <h2 className="text-lg font-semibold text-stone-800">
                {editing ? "Editar categoría" : "Nueva categoría"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Nombre *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">Descripción</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  URL de imagen (opcional)
                </label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 border border-stone-200 text-stone-600 rounded-lg py-2.5 text-sm font-medium hover:bg-stone-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-primary text-sm disabled:opacity-60"
                >
                  {loading ? "Guardando..." : editing ? "Guardar cambios" : "Crear categoría"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
