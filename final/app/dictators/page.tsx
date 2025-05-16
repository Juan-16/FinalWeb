'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Plus, Trash2, RefreshCw, Eye } from 'lucide-react';
import { getAllDictators, deleteDictator } from '../services/dictatorService';
import { Dictator } from '../schemas/Dictator';

export default function DictatorsPage() {
  const [dictators, setDictators] = useState<Dictator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string>('');

  const fetchDictators = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllDictators();
      setDictators(data);
    } catch (e: any) {
      setError(e.message || 'Error al cargar dictadores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDictators();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este dictador?')) return;
    setActionLoading(id);
    try {
      await deleteDictator(id);
      await fetchDictators();
    } catch (e: any) {
      setError(e.message || 'Error al eliminar dictador');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-gray-200">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold">Dictadores</h1>
        <Link
          href="/dictators/new"
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
        <div className="text-center text-gray-500 py-20">Cargando dictadores...</div>
      ) : dictators.length === 0 ? (
        <p className="text-center text-gray-500">No hay dictadores registrados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dictators.map((d) => (
            <div
              key={d.id}
              className="bg-neutral-800 p-6 rounded-2xl shadow-lg border border-neutral-700 flex flex-col justify-between hover:shadow-xl transition"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">{d.name}</h2>
                <p className="text-gray-400 mb-1">Territorio: {d.territory}</p>
                <p className="text-gray-400 mb-1">Esclavos: {d.number_of_slaves}</p>
                <p className="text-gray-400 mb-1">Lealtad: <span className="font-semibold">{d.loyalty}%</span></p>
                <p className="text-gray-400">Rol: <span className="font-medium">{d.role || 'N/A'}</span></p>
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => handleDelete(d.id!)}
                  disabled={actionLoading === d.id}
                  className="flex items-center gap-2 bg-red-800 hover:bg-red-700 text-white px-3 py-1 rounded-lg shadow transition disabled:opacity-50"
                  title="Eliminar dictador"
                >
                  {actionLoading === d.id ? '...' : <Trash2 className="h-4 w-4" />}
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={fetchDictators}
        disabled={loading}
        className="fixed bottom-6 right-6 bg-neutral-700 hover:bg-neutral-600 text-gray-200 rounded-full p-3 shadow-xl transition"
        title="Refrescar lista"
      >
        <RefreshCw className="h-6 w-6" />
      </button>
    </div>
  );
}
