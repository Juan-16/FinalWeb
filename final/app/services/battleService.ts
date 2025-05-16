// services/battleService.ts
import axios from 'axios';
import { BattleCreate, Battle } from '../schemas/Battle';

const baseURL = 'http://localhost:3001';

export const getBattles = async (): Promise<Battle[]> => {
  const { data } = await axios.get(`${baseURL}/battles`);
  return data;
};

export const createBattle = async (
  dictatorId: string,
  battle: BattleCreate
): Promise<Battle> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No estás autenticado.');
  }

  try {
    const payload = { dictatorId, ...battle };
    const { data } = await axios.post(`${baseURL}/battles`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,    // ← Aquí va el token
      },
    });
    return data;
  } catch (err: any) {
    // Si tu backend devuelve .message, lo usamos; si no, mensaje genérico
    throw new Error(err.response?.data?.message || 'Error al crear batalla');
  }
};
