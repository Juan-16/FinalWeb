'use client';

import React, { useState } from 'react';
import { createSlave } from '../../services/slavesService';
import { Status } from '../../schemas/Slave';

const initialFormState = {
  name: '',
  nickname: '',
  origin: '',
  strength: 1,
  agility: 1,
  wins: 0,
  losses: 0,
  status: Status.ALIVE,
};

export default function NewSlavePage() {
  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]:
        name === 'strength' || name === 'agility' || name === 'wins' || name === 'losses'
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createSlave(form);
      setSuccess(true);
      setForm(initialFormState);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      setError(e.message || 'Error al crear esclavo');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 flex flex-col items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-neutral-900 text-gray-200 rounded-lg shadow-2xl p-8 max-w-lg w-full space-y-6 border border-neutral-700"
      >
        <h2 className="text-3xl font-extrabold text-red-800 mb-6 text-center tracking-wide">
          Agregar Nuevo Esclavo
        </h2>

        <div>
          <label htmlFor="name" className="block mb-1 font-semibold">
            Nombre
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ej: Damian"
            required
            className="w-full rounded-md bg-neutral-700 border border-neutral-700 focus:border-red-600 focus:outline-none px-3 py-2 text-lg transition"
          />
        </div>

        <div>
          <label htmlFor="nickname" className="block mb-1 font-semibold">
            Apodo
          </label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            placeholder="Ej: BloodLust"
            required
            className="w-full rounded-md bg-neutral-700 border border-neutral-700 focus:border-red-600 focus:outline-none px-3 py-2 text-lg transition"
          />
        </div>

        <div>
          <label htmlFor="origin" className="block mb-1 font-semibold">
            Origen
          </label>
          <input
            type="text"
            id="origin"
            name="origin"
            value={form.origin}
            onChange={handleChange}
            placeholder="Ej: Roma"
            required
            className="w-full rounded-md bg-neutral-700 border border-neutral-700 focus:border-red-600 focus:outline-none px-3 py-2 text-lg transition"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="strength" className="block mb-1 font-semibold">
              Fuerza (1 a 100)
            </label>
            <input
              type="number"
              id="strength"
              name="strength"
              min={1}
              max={100}
              value={form.strength}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-neutral-700 border border-neutral-700 focus:border-red-600 focus:outline-none px-3 py-2 text-lg transition"
            />
            <p className="text-xs text-gray-500 mt-1">
              Potencia física y resistencia
            </p>
          </div>

          <div>
            <label htmlFor="agility" className="block mb-1 font-semibold">
              Agilidad (1 a 100)
            </label>
            <input
              type="number"
              id="agility"
              name="agility"
              min={1}
              max={100}
              value={form.agility}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-neutral-700 border border-neutral-700 focus:border-red-600 focus:outline-none px-3 py-2 text-lg transition"
            />
            <p className="text-xs text-gray-500 mt-1">
              Velocidad y destreza
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="wins" className="block mb-1 font-semibold">
              Victorias
            </label>
            <input
              type="number"
              id="wins"
              name="wins"
              min={0}
              value={form.wins}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-neutral-700 border border-neutral-700 focus:border-red-600 focus:outline-none px-3 py-2 text-lg transition"
            />
          </div>

          <div>
            <label htmlFor="losses" className="block mb-1 font-semibold">
              Derrotas
            </label>
            <input
              type="number"
              id="losses"
              name="losses"
              min={0}
              value={form.losses}
              onChange={handleChange}
              required
              className="w-full rounded-md bg-neutral-700 border border-neutral-700 focus:border-red-600 focus:outline-none px-3 py-2 text-lg transition"
            />
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block mb-1 font-semibold">
            Estado
          </label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            className="w-full rounded-md bg-neutral-700 border border-neutral-700 focus:border-red-600 focus:outline-none px-3 py-2 text-lg transition"
          >
            <option value={Status.ALIVE}>Vivo</option>
            <option value={Status.ESCAPED}>Escapado</option>
            <option value={Status.FREE}>Libre</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 mt-4 bg-red-800 hover:bg-red-800 text-gray-200 font-bold rounded-md transition"
        >
          Guardar
        </button>
      </form>

      {(error || success) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 pointer-events-none">
          <div
            className={`pointer-events-auto bg-neutral-900 border border-red-600 rounded-lg px-6 py-4 max-w-sm w-full text-center
              text-gray-100 font-semibold shadow-lg
              transition-transform duration-500 ease-in-out
              ${success ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
            role="alert"
          >
            {success ? 'Esclavo creado con éxito!' : error}
          </div>
        </div>
      )}
    </main>
  );
}
