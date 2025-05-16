'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createDictator } from '../../services/dictatorService';
import { Dictator } from '../../schemas/Dictator';

export default function NewDictatorPage() {
  const router = useRouter();
  const [form, setForm] = useState<Omit<Dictator, 'id'>>({
    name: '',
    territory: '',
    number_of_slaves: 0,
    loyalty: 50,
    role: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'number_of_slaves' || name === 'loyalty'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createDictator(form);
      router.push('/dictators');
    } catch (e: any) {
      setError(e.message || 'Error al crear dictador');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-800 text-gray-100 p-8 rounded-xl shadow-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Nuevo Dictador</h2>

        {error && <p className="text-red-500">{error}</p>}

        <div>
          <label className="block mb-1">Nombre</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-neutral-700 rounded border border-neutral-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-1">Territorio</label>
          <input
            type="text"
            name="territory"
            value={form.territory}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-neutral-700 rounded border border-neutral-600 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1"># Esclavos</label>
            <input
              type="number"
              name="number_of_slaves"
              value={form.number_of_slaves}
              onChange={handleChange}
              min={0}
              className="w-full px-3 py-2 bg-neutral-700 rounded border border-neutral-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="block mb-1">Lealtad (1-100)</label>
            <input
              type="number"
              name="loyalty"
              value={form.loyalty}
              onChange={handleChange}
              min={1}
              max={100}
              className="w-full px-3 py-2 bg-neutral-700 rounded border border-neutral-600 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1">Rol (opcional)</label>
          <input
            type="text"
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-neutral-700 rounded border border-neutral-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-1">Contraseña</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-neutral-700 rounded border border-neutral-600 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold py-2 rounded transition-shadow shadow-md"
        >
          Crear Dictador
        </button>
      </form>
    </div>
  );
}
