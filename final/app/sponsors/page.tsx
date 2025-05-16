'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import { getSponsors, deleteSponsor } from '../services/sponsorService';
import { Sponsor } from '../schemas/Sponsor';

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string>('');

  // Cambia esto para obtener tu token real (contexto, redux, etc)
  const token = 'tu-token-aqui';

  const fetchSponsors = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getSponsors();
      setSponsors(data);
    } catch (e: any) {
      setError(e.message || 'Error al cargar sponsors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSponsors();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este sponsor?')) return;
    setActionLoading(id);
    try {
      await deleteSponsor(id, token);
      await fetchSponsors();
    } catch (e: any) {
      setError(e.message || 'Error al eliminar sponsor');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-gray-200">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold">Sponsors</h1>
        <Link
          href="/sponsors/new"
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-neutral-900 font-semibold px-4 py-2 rounded-full shadow-md transition"
        >
          <Plus className="h-5 w-5" />
          Agregar
        </Link>
      </header>

      {error && (
        <div className="mb-6 bg-red-800 text-red-200 p-4 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-500 py-20">Cargando sponsors...</div>
      ) : sponsors.length === 0 ? (
        <p className="text-center text-gray-500">No hay sponsors registrados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsors.map((s) => (
            <div
              key={s.id}
              className="bg-neutral-800 p-6 rounded-2xl shadow-lg border border-neutral-700 flex flex-col justify-between hover:shadow-xl transition"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">{s.company_name}</h2>
                <p className="text-gray-400 mb-1">
                  <strong>Ítems donados:</strong> {s.donated_items.join(', ')}
                </p>
                <p className="text-gray-400 mb-1">
                  <strong>Luchador preferido:</strong> {s.preferred_fighter?.name || 'No asignado'}
                </p>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => handleDelete(s.id!)}
                  disabled={actionLoading === s.id}
                  className="flex items-center gap-2 bg-red-800 hover:bg-red-700 text-white px-3 py-1 rounded-lg shadow transition disabled:opacity-50"
                  title="Eliminar sponsor"
                >
                  {actionLoading === s.id ? '...' : <Trash2 className="h-4 w-4" />}
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={fetchSponsors}
        disabled={loading}
        className="fixed bottom-6 right-6 bg-neutral-700 hover:bg-neutral-600 text-gray-200 rounded-full p-3 shadow-xl transition"
        title="Refrescar lista"
      >
        <RefreshCw className="h-6 w-6" />
      </button>
    </div>
  );
}
