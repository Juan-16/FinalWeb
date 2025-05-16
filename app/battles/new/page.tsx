'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBattle } from '../../services/battleService';
import { getSlaves } from '../../services/slavesService';
import Slave from '../../schemas/Slave';
import type { BattleCreate } from '../../schemas/Battle';

export default function NewBattle() {
  const router = useRouter();
  const [slaves, setSlaves] = useState<Slave[]>([]);
  const [loadingSlaves, setLoadingSlaves] = useState(true);
  const [form, setForm] = useState<BattleCreate>({
    contestant_1: '',
    contestant_2: '',
    winner_id: '',
    injuries: '',
    date: new Date().toISOString().substring(0, 10),
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const dictatorId = typeof window !== 'undefined'
    ? localStorage.getItem('dictatorId') || ''
    : '';

  useEffect(() => {
    getSlaves()
      .then((data) => setSlaves(data))
      .catch(() => setError('No se pudieron cargar los esclavos'))
      .finally(() => setLoadingSlaves(false));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!dictatorId) {
      setError('Debes iniciar sesión primero.');
      return;
    }
    if (form.contestant_1 === form.contestant_2) {
      setError('Los combatientes deben ser diferentes.');
      return;
    }

    setSubmitting(true);
    try {
      await createBattle(dictatorId, form);
      router.push('/battles');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingSlaves) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
        Cargando esclavos…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Crear Batalla
      </h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 bg-neutral-800 p-6 rounded-lg shadow-lg"
      >
        {/* Combatiente 1 */}
        <div>
          <label className="block mb-1 font-medium">Combatiente 1</label>
          <select
            name="contestant_1"
            value={form.contestant_1}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-neutral-700"
          >
            <option value="" disabled>
              Selecciona un esclavo
            </option>
            {slaves.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.nickname})
              </option>
            ))}
          </select>
        </div>

        {/* Combatiente 2 */}
        <div>
          <label className="block mb-1 font-medium">Combatiente 2</label>
          <select
            name="contestant_2"
            value={form.contestant_2}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-neutral-700"
          >
            <option value="" disabled>
              Selecciona un esclavo
            </option>
            {slaves.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.nickname})
              </option>
            ))}
          </select>
        </div>

        {/* Ganador */}
        <div>
          <label className="block mb-1 font-medium">
            Ganador (opcional)
          </label>
          <select
            name="winner_id"
            value={form.winner_id}
            onChange={handleChange}
            className="w-full p-2 rounded bg-neutral-700"
          >
            <option value="">— Ninguno —</option>
            {slaves
              .filter(
                (s) =>
                  s.id === form.contestant_1 || s.id === form.contestant_2
              )
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.nickname})
                </option>
              ))}
          </select>
        </div>

        {/* Lesiones */}
        <div>
          <label className="block mb-1 font-medium">Lesiones</label>
          <input
            name="injuries"
            value={form.injuries}
            onChange={handleChange}
            required
            placeholder="Descripción de lesiones"
            className="w-full p-2 rounded bg-neutral-700"
          />
        </div>

        {/* Fecha */}
        <div>
          <label className="block mb-1 font-medium">Fecha</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-neutral-700"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full ${
            submitting ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'
          } text-white py-2 rounded-lg font-semibold transition-shadow shadow-md`}
        >
          {submitting ? 'Creando…' : 'Crear Batalla'}
        </button>
      </form>
    </div>
  );
}
