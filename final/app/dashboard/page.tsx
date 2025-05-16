'use client';

import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();

  const dictatorId = localStorage.getItem('dictatorId');

  if (!dictatorId) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center p-8">
      <h1 className="text-4xl mt-8 mb-6">Bienvenido, Dictador</h1>
      <div className="flex gap-8">
        <button
          onClick={() => router.push(`/dictators/${dictatorId}/slaves`)}
          className="bg-amber-600 hover:bg-amber-700 px-8 py-4 rounded-lg text-xl font-semibold shadow"
        >
          Ver / Comprar Esclavos
        </button>
        <button
          onClick={() => router.push('/battles')}
          className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-lg text-xl font-semibold shadow"
        >
          Crear / Ver Batallas
        </button>
         <button
          onClick={() => router.push('/black-market')}
          className="bg-gray-600 hover:bg-gray-700 px-8 py-4 rounded-lg text-xl font-semibold shadow"
        >
          Mercado Negro
        </button>
      </div>
    </div>
  );
}
