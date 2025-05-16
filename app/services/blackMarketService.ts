'use client';

import { BlackMarketTransaction, BlackMarketTransactionCreate } from '@/app/schemas/BlackMarketTransaction';

const BASE_URL = 'http://localhost:3001/black-market';

export async function getAllBlackMarketTransactions(): Promise<BlackMarketTransaction[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Error al obtener las transacciones');
  return res.json();
}

export async function createBlackMarketTransaction(
  data: BlackMarketTransactionCreate
): Promise<BlackMarketTransaction> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Error al crear la transacción');
  return res.json();
}

export async function deleteBlackMarketTransaction(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) throw new Error('Error al eliminar la transacción');
}
