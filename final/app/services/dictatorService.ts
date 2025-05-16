import axios from 'axios';
import { Dictator } from '../schemas/Dictator';
import Slave from '../schemas/Slave';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const getAllDictators = async (): Promise<Dictator[]> => {
  try {
    const response = await axios.get(`${baseURL}/dictators`);
    return response.data;
  } catch (error: any) {
    throw new Error('Error al obtener los dictadores: ' + (error.response?.data?.message || error.message));
  }
};

export const createDictator = async (dictatorData: Omit<Dictator, 'id'>): Promise<Dictator> => {
  try {
    const response = await axios.post(`${baseURL}/dictators`, dictatorData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al crear el dictador');
  }
};

export const deleteDictator = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${baseURL}/dictators/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al eliminar el dictador');
  }
};

// Nuevo: obtener esclavos de un dictador
export const getSlavesOfDictator = async (id: string): Promise<Slave[]> => {
  try {
    const { data } = await axios.get(`${baseURL}/dictators/${id}/slaves`);
    return data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'Error al obtener esclavos');
  }
};

// Obtener esclavos sin dictador
export const getUnassignedSlaves = async (): Promise<Slave[]> => {
  try {
    const { data } = await axios.get(`${baseURL}/slaves/unassigned`);
    return data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'Error al obtener esclavos libres');
  }
};

// Asignar esclavo (ya lo tenías)
export const assignSlave = async (dictatorId: string, slaveId: string): Promise<Slave> => {
  try {
    const { data } = await axios.post(`${baseURL}/dictators/${dictatorId}/assign-slave/${slaveId}`);
    return data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'Error al asignar esclavo');
  }
};

