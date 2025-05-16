'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { createBlackMarketTransaction } from '@/app/services/blackMarketService';
import { BlackMarketTransactionCreate, BlackMarketStatus } from '@/app/schemas/BlackMarketTransaction';
import { getAllDictators } from '@/app/services/dictatorService';

interface DictatorMini {
  id: string;
  name: string;
}

export default function BlackMarketPageNew() {
  const router = useRouter();

  const [dictators, setDictators] = useState<DictatorMini[]>([]);
  const [form, setForm] = useState<BlackMarketTransactionCreate>({
    buyerId: '',
    sellerId: '',
    item: '',
    amount: 1,
    status: 'Completed',
    isRansom: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

useEffect(() => {
  const fetchDictators = async () => {
    try {
      const data = await getAllDictators();
      const normalizedData: DictatorMini[] = data
        .filter(d => d.id && d.name)
        .map(d => ({ id: d.id!, name: d.name! }));
      setDictators(normalizedData);
    } catch {
      setError('Error al cargar dictadores');
    }
  };
  fetchDictators();
}, []);


 const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const target = e.target as HTMLInputElement | HTMLSelectElement;
  const { name, value, type } = target;
  const checked = type === 'checkbox' ? (target as HTMLInputElement).checked : undefined;

  setForm(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value,
  }));
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createBlackMarketTransaction(form);
      router.push('/black-market');
    } catch (e: any) {
      setError(e.message || 'Error al crear la transacción');
    } finally {
      setLoading(false);
    }
  };

  const statusOptions: BlackMarketStatus[] = ['Completed', 'Failed', 'Discovered'];

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-gray-200">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold">Nueva Transacción del Mercado Negro</h1>
      </header>

      {error && (
        <div className="mb-6 bg-red-800 text-red-200 p-4 rounded-lg">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-neutral-800 p-6 rounded-2xl shadow-lg border border-neutral-700"
      >
        <div className="mb-4">
          <label htmlFor="buyerId" className="block mb-2 font-semibold">
            Comprador
          </label>
          <select
            id="buyerId"
            name="buyerId"
            value={form.buyerId}
            onChange={handleChange}
            required
            className="w-full bg-neutral-700 text-gray-200 px-3 py-2 rounded-lg"
          >
            <option value="" disabled>
              Selecciona un comprador
            </option>
            {dictators.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="sellerId" className="block mb-2 font-semibold">
            Vendedor
          </label>
          <select
            id="sellerId"
            name="sellerId"
            value={form.sellerId}
            onChange={handleChange}
            required
            className="w-full bg-neutral-700 text-gray-200 px-3 py-2 rounded-lg"
          >
            <option value="" disabled>
              Selecciona un vendedor
            </option>
            {dictators.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="item" className="block mb-2 font-semibold">
            Ítem
          </label>
          <input
            id="item"
            name="item"
            type="text"
            value={form.item}
            onChange={handleChange}
            placeholder="Nombre del ítem"
            required
            className="w-full bg-neutral-700 text-gray-200 px-3 py-2 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="block mb-2 font-semibold">
            Cantidad
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            min={1}
            required
            className="w-full bg-neutral-700 text-gray-200 px-3 py-2 rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="status" className="block mb-2 font-semibold">
            Estado
          </label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            className="w-full bg-neutral-700 text-gray-200 px-3 py-2 rounded-lg"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6 flex items-center gap-2">
          <input
            id="isRansom"
            name="isRansom"
            type="checkbox"
            checked={form.isRansom || false}
            onChange={handleChange}
            className="w-5 h-5"
          />
          <label htmlFor="isRansom" className="font-semibold">
            ¿Es rescate?
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-neutral-900 font-semibold px-5 py-3 rounded-full shadow-md transition disabled:opacity-50"
        >
          <Plus className="h-5 w-5" />
          {loading ? 'Creando...' : 'Crear'}
        </button>
      </form>
    </div>
  );
}
