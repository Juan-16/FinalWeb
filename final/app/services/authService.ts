import axios from 'axios';
import { LoginSchema } from '../schemas/Login'; // Ajusta la ruta según donde tengas el schema

const baseURL = 'http://localhost:3001'; // Cambia a tu URL backend

export const login = async (name: string, password: string): Promise<LoginSchema> => {
  try {
    const { data } = await axios.post<LoginSchema>(`${baseURL}/dictators/login`, { name, password });
    return data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'Error al iniciar sesión');
  }
};
