'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Plus, Trash2, RefreshCw } from 'lucide-react';
import {
  getAllBlackMarketTransactions,
  deleteBlackMarketTransaction,
} from '@/app/services/blackMarketService';
import { BlackMarketTransaction } from '@/app/schemas/BlackMarketTransaction';

export default function BlackMarketPage() {
  const [transactions, setTransactions] = useState<BlackMarketTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState<string>('');

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllBlackMarketTransactions();
      setTransactions(data);
    } catch (e: any) {
      setError(e.message || 'Error al cargar transacciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar esta transacción?')) return;
    setActionLoading(id);
    try {
      await deleteBlackMarketTransaction(id);
      await fetchTransactions();
    } catch (e: any) {
      setError(e.message || 'Error al eliminar transacción');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-gray-200">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold">Mercado Negro</h1>
        <Link
          href="/black-market/new"
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
        <div className="text-center text-gray-500 py-20">Cargando transacciones...</div>
      ) : transactions.length === 0 ? (
        <p className="text-center text-gray-500">No hay transacciones registradas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="bg-neutral-800 p-6 rounded-2xl shadow-lg border border-neutral-700 flex flex-col justify-between hover:shadow-xl transition"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">{t.item}</h2>
                <p className="text-gray-400 mb-1">
                  Comprador: <span className="font-semibold">{t.buyer.name}</span>
                </p>
                <p className="text-gray-400 mb-1">
                  Vendedor: <span className="font-semibold">{t.seller.name}</span>
                </p>
                <p className="text-gray-400 mb-1">
                  Cantidad: <span className="font-semibold">{t.amount}</span>
                </p>
                <p className="text-gray-400 mb-1">
                  Estado: <span className="font-semibold">{t.status}</span>
                </p>
                {t.isRansom !== undefined && (
                  <p className="text-gray-400 mb-1">
                    ¿Es rescate? <span className="font-semibold">{t.isRansom ? 'Sí' : 'No'}</span>
                  </p>
                )}
              </div>

              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => handleDelete(t.id)}
                  disabled={actionLoading === t.id}
                  className="flex items-center gap-2 bg-red-800 hover:bg-red-700 text-white px-3 py-1 rounded-lg shadow transition disabled:opacity-50"
                  title="Eliminar transacción"
                >
                  {actionLoading === t.id ? '...' : <Trash2 className="h-4 w-4" />}
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={fetchTransactions}
        disabled={loading}
        className="fixed bottom-6 right-6 bg-neutral-700 hover:bg-neutral-600 text-gray-200 rounded-full p-3 shadow-xl transition"
        title="Refrescar lista"
      >
        <RefreshCw className="h-6 w-6" />
      </button>
    </div>
  );
}
