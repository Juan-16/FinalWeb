import axios from "axios";
import Slave, { Status } from '../schemas/Slave';
const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const getSlaves = async (): Promise<Slave[]> => {
  try {
    const response = await axios.get(`${baseURL}/slaves`);
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener los esclavos: " + error);
  }
};

export const createSlave = async (slave: Omit<Slave, 'id'>): Promise<Slave> => {
  try {
    const response = await axios.post(`${baseURL}/slaves`, slave);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al crear el esclavo');
  }
};

export const updateSlaveStatus = async (id: string, status: Status): Promise<Slave> => {
  try {
    const response = await axios.patch(`${baseURL}/slaves/${id}/status`, { status });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al actualizar el estado del esclavo');
  }
};

export const deleteSlave = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${baseURL}/slaves/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al eliminar el esclavo');
  }
};