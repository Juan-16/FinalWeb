'use client';

import { useRouter, usePathname } from 'next/navigation';

import { useEffect, useState } from 'react';
import { getSlavesOfDictator } from '../../../services/dictatorService';
import Slave from '../../../schemas/Slave';
import { ArrowLeft } from 'lucide-react';

export default function DictatorSlavesPage() {
  const router = useRouter();
  const path = usePathname();
  const dictatorId = path.split('/')[2];
  const [slaves, setSlaves] = useState<Slave[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const data = await getSlavesOfDictator(dictatorId);
        setSlaves(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, [dictatorId]);

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-gray-100">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center text-amber-600 hover:underline"
      >
        <ArrowLeft className="h-5 w-5 mr-1" />
        Volver
      </button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Esclavos del Dictador</h1>
        <button
          onClick={() => router.push(`/dictators/${dictatorId}/slaves/assign`)}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md shadow-md transition"
        >
          Comprar esclavo
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {loading ? (
        <p>Cargando esclavos...</p>
      ) : slaves.length === 0 ? (
        <p>No hay esclavos asignados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {slaves.map((s) => (
            <div
              key={s.id}
              className="bg-neutral-800 p-4 rounded-lg shadow-md border border-neutral-700"
            >
              <h2 className="text-xl font-semibold mb-1">
                {s.name} ({s.nickname})
              </h2>
              <p><strong>Origen:</strong> {s.origin}</p>
              <p><strong>Fuerza:</strong> {s.strength}</p>
              <p><strong>Agilidad:</strong> {s.agility}</p>
              <p><strong>Victorias:</strong> {s.wins}</p>
              <p><strong>Derrotas:</strong> {s.losses}</p>
              <p><strong>Estado:</strong> {s.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
