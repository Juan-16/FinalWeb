'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getUnassignedSlaves, assignSlave } from '../../../../services/dictatorService';
import Slave from '../../../../schemas/Slave';
import { ArrowLeft } from 'lucide-react';

export default function AssignSlavePage() {
  const router = useRouter();
  const path = usePathname();
  const dictatorId = path.split('/')[2];

  const [slaves, setSlaves] = useState<Slave[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string>('');
  const [error, setError] = useState('');

  // Cargar solo los esclavos sin asignar
  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const data = await getUnassignedSlaves();
        setSlaves(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  const handleAssign = async (slaveId: string) => {
    setActionLoading(slaveId);
    setError('');
    try {
      await assignSlave(dictatorId, slaveId);
      // Refrescar la lista
      setSlaves((prev) => prev.filter((s) => s.id !== slaveId));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setActionLoading('');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-gray-100">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center text-amber-600 hover:underline"
      >
        <ArrowLeft className="h-5 w-5 mr-1" />
        Volver
      </button>

      <h1 className="text-3xl font-bold mb-6">Asignar Esclavo</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p>Cargando esclavos disponibles...</p>
      ) : slaves.length === 0 ? (
        <p>No hay esclavos libres para asignar.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {slaves.map((s) => (
            <div
              key={s.id}
              className="bg-neutral-800 p-4 rounded-lg shadow-md border border-neutral-700 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold mb-1">{s.name}</h2>
                <p className="text-gray-400 mb-1">Apodo: {s.nickname}</p>
                <p className="text-gray-400 mb-1">Origen: {s.origin}</p>
                <p className="text-gray-400 mb-1">Fuerza: {s.strength}</p>
                <p className="text-gray-400 mb-1">Agilidad: {s.agility}</p>
              </div>
             <button
  onClick={() => handleAssign(s.id!)}
  disabled={actionLoading === s.id}
  className="mt-4 bg-amber-700 hover:bg-amber-600 text-white px-3 py-1 rounded-md shadow transition disabled:opacity-50"
>
  {actionLoading === s.id ? '...' : 'Comprar'}
</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
