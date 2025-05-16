'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBattles } from '../services/battleService';
import { Battle } from '../schemas/Battle';

export default function BattlesPage() {
  const router = useRouter();
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBattles = async () => {
      try {
        const data = await getBattles();
        setBattles(data);
      } catch (err: any) {
        setError(err.message || 'Error al cargar batallas');
      } finally {
        setLoading(false);
      }
    };

    fetchBattles();
  }, []);

  if (loading)
    return (
      <p className="text-white text-center mt-10 text-xl font-medium">
        Cargando batallas...
      </p>
    );

  if (error)
    return (
      <p className="text-red-500 text-center mt-10 text-xl font-medium">{error}</p>
    );

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6 max-w-3xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-wide">Batallas</h1>
        <button
          onClick={() => router.push('/battles/new')}
          className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-full text-lg font-semibold shadow-lg transition-transform active:scale-95"
          aria-label="Crear nueva batalla"
        >
          + Crear Batalla
        </button>
      </header>

      {battles.length === 0 ? (
        <p className="text-gray-400 text-center text-lg italic">
          No hay batallas registradas aún.
        </p>
      ) : (
        <ul className="space-y-5">
          {battles.map((battle) => (
            <li
              key={battle.id}
              className="bg-neutral-800 rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/battles/${battle.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter') router.push(`/battles/${battle.id}`);
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold">
                  Batalla ID: <span className="font-mono">{battle.id}</span>
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    battle.winner
                      ? 'bg-green-700 text-green-300'
                      : 'bg-gray-600 text-gray-400'
                  }`}
                >
                  {battle.winner ? 'Finalizada' : 'En curso'}
                </span>
              </div>

              <p>
                <strong>Esclavo 1:</strong>{' '}
                <span className="text-amber-400 font-semibold">{battle.contestant_1.name}</span>{' '}
                (ID: {battle.contestant_1.id})
              </p>
              <p>
                <strong>Esclavo 2:</strong>{' '}
                <span className="text-amber-400 font-semibold">{battle.contestant_2.name}</span>{' '}
                (ID: {battle.contestant_2.id})
              </p>
              <p>
                <strong>Ganador:</strong>{' '}
                {battle.winner ? (
                  <span className="text-green-400 font-semibold">{battle.winner.name}</span>
                ) : (
                  <span className="text-gray-400 italic">No definido</span>
                )}
              </p>
              <p>
                <strong>Lesiones:</strong>{' '}
                <span className="italic text-gray-300">{battle.injuries}</span>
              </p>
              <p className="text-sm text-gray-400">
                <strong>Fecha:</strong> {new Date(battle.date).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
