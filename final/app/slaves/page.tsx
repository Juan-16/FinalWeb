'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Slave, { Status } from '../schemas/Slave';
import { getSlaves, updateSlaveStatus, deleteSlave } from '../services/slavesService';
import { Plus, Trash2, RefreshCw } from 'lucide-react';

export default function SlavesPage() {
  const [slaves, setSlaves] = useState<Slave[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<string>(''); // id del esclavo en acción

  const fetchSlaves = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getSlaves();
      setSlaves(data);
    } catch (e: any) {
      setError(e.message || 'Error al cargar esclavos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlaves();
  }, []);

  const handleChangeStatus = async (id: string, newStatus: Status) => {
    setActionLoading(id);
    setError('');
    try {
      await updateSlaveStatus(id, newStatus);
      await fetchSlaves();
    } catch (e: any) {
      setError(e.message || 'Error al actualizar estado');
    } finally {
      setActionLoading('');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro que quieres eliminar este esclavo? Esta acción no se puede deshacer.')) return;
    setActionLoading(id);
    setError('');
    try {
      await deleteSlave(id);
      await fetchSlaves();
    } catch (e: any) {
      setError(e.message || 'Error al eliminar esclavo');
    } finally {
      setActionLoading('');
    }
  };

  const renderStatus = (status: Status) => {
    let color = 'bg-gray-500';
    let label = 'Desconocido';

    switch (status) {
      case Status.ALIVE:
        color = 'bg-green-600';
        label = 'Vivo';
        break;
      case Status.DEAD:
        color = 'bg-red-700';
        label = 'Muerto';
        break;
      case Status.ESCAPED:
        color = 'bg-yellow-500';
        label = 'Escapado';
        break;
      case Status.FREE:
        color = 'bg-blue-600';
        label = 'Libre';
        break;
    }

    return (
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${color}`}>
        {label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-gray-100">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-wide">Lista de Esclavos</h1>
        <Link
          href="/slaves/new"
          className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-gray-900 rounded-full px-4 py-2 font-semibold transition-shadow shadow-md hover:shadow-lg"
          title="Agregar nuevo esclavo"
        >
          <Plus className="h-5 w-5" />
          Agregar
        </Link>
      </header>

      {error && (
        <div className="mb-4 text-red-500 font-semibold bg-red-900 p-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-20 text-gray-400">Cargando esclavos...</div>
      ) : slaves.length === 0 ? (
        <p className="text-center text-gray-400">No hay esclavos registrados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slaves.map(slave => (
            <div
              key={slave.id}
              className="bg-neutral-800 p-5 rounded-xl shadow-md border border-neutral-700 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-2xl font-semibold mb-1">
                  {slave.name} <span className="text-amber-500">({slave.nickname})</span>
                </h2>
                <p className="mb-2 text-gray-400 italic">Origen: {slave.origin}</p>
                <div className="mb-3 flex gap-3">
                  <p><strong>Fuerza:</strong> {slave.strength}</p>
                  <p><strong>Agilidad:</strong> {slave.agility}</p>
                </div>
                <div className="mb-3 flex gap-3">
                  <p><strong>Victorias:</strong> {slave.wins}</p>
                  <p><strong>Derrotas:</strong> {slave.losses}</p>
                </div>
                <div>
                  <strong>Estado:</strong> {renderStatus(slave.status)}
                </div>
              </div>

              <div className="mt-4 flex justify-end gap-3">
                {slave.status !== Status.DEAD && (
                  <>
                    <button
                      onClick={() => handleChangeStatus(slave.id, Status.DEAD)}
                      disabled={actionLoading === slave.id}
                      className="bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Marcar como muerto"
                    >
                      {actionLoading === slave.id ? '...' : 'Marcar Muerto'}
                    </button>
                    {slave.status !== Status.ESCAPED && (
                      <button
                        onClick={() => handleChangeStatus(slave.id, Status.ESCAPED)}
                        disabled={actionLoading === slave.id}
                        className="bg-red-900 hover:bg-red-800 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Marcar como escapado"
                      >
                        {actionLoading === slave.id ? '...' : 'Escapó'}
                      </button>
                    )}
                  </>
                )}

                <button
                  onClick={() => handleDelete(slave.id)}
                  disabled={actionLoading === slave.id}
                  className="bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-md transition duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Eliminar esclavo"
                >
                  {actionLoading === slave.id ? '...' : <><Trash2 className="h-4 w-4" />Eliminar</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={fetchSlaves}
        disabled={loading}
        className="fixed bottom-6 right-6 bg-neutral-700 hover:bg-neutral-600 text-gray-200 rounded-full p-3 shadow-lg transition duration-200"
        title="Refrescar lista"
      >
        <RefreshCw className="h-6 w-6" />
      </button>
    </div>
  );
}
