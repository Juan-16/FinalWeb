'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSlaves } from '../../services/slavesService';
import { createSponsor } from '../../services/sponsorService';
import Slave from '../../schemas/Slave';

export default function NewSponsorPage() {
  const router = useRouter();
  const [slaves, setSlaves] = useState<Slave[]>([]);
  const [loadingSlaves, setLoadingSlaves] = useState(true);

  const [companyName, setCompanyName] = useState('');
  const [donatedItems, setDonatedItems] = useState(['']);
  const [preferredFighterId, setPreferredFighterId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Carga los esclavos para el select
  useEffect(() => {
    getSlaves()
      .then((data) => setSlaves(data))
      .catch(() => setError('No se pudieron cargar los esclavos'))
      .finally(() => setLoadingSlaves(false));
  }, []);

  const handleAddDonatedItem = () => {
    setDonatedItems((prev) => [...prev, '']);
  };

  const handleDonatedItemChange = (idx: number, value: string) => {
    setDonatedItems((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!companyName.trim()) return setError('El nombre de la empresa es obligatorio');
    if (donatedItems.some((it) => !it.trim())) return setError('Todos los ítems donados son obligatorios');
    if (!preferredFighterId) return setError('Debes seleccionar un luchador preferido');

    try {
      await createSponsor(
        {
          company_name: companyName,
          donated_items: donatedItems.map((it) => it.trim()),
          preferred_fighter: preferredFighterId,
        },
        localStorage.getItem('token') || ''
      );
      setSuccess('Sponsor creado con éxito');
      // Resetea el formulario
      setCompanyName('');
      setDonatedItems(['']);
      setPreferredFighterId('');
      // opcional: redirigir tras un segundo
      setTimeout(() => router.push('/sponsors'), 1000);
    } catch (err: any) {
      setError(err.message || 'Error al crear sponsor');
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
      <h1 className="text-3xl font-semibold mb-6 text-center">Crear Sponsor</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-5 bg-neutral-800 p-6 rounded-lg shadow-lg">
        {/* Empresa */}
        <div>
          <label className="block mb-1 font-medium">Nombre de la empresa</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full p-2 rounded bg-neutral-700"
            required
          />
        </div>

        {/* Ítems donados */}
        <div>
          <label className="block mb-1 font-medium">Ítems donados</label>
          {donatedItems.map((item, idx) => (
            <input
              key={idx}
              type="text"
              value={item}
              onChange={(e) => handleDonatedItemChange(idx, e.target.value)}
              className="w-full p-2 mb-2 rounded bg-neutral-700"
              placeholder="Descripción del ítem"
              required
            />
          ))}
          <button
            type="button"
            onClick={handleAddDonatedItem}
            className="text-amber-400 hover:underline"
          >
            + Agregar ítem
          </button>
        </div>

        {/* Luchador preferido */}
        <div>
          <label className="block mb-1 font-medium">Luchador preferido</label>
          <select
            value={preferredFighterId}
            onChange={(e) => setPreferredFighterId(e.target.value)}
            className="w-full p-2 rounded bg-neutral-700"
            required
          >
            <option value="">— Selecciona un esclavo —</option>
            {slaves.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.nickname})
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition-shadow shadow-md"
        >
          Crear Sponsor
        </button>
      </form>
    </div>
  );
}
