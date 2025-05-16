import axios from 'axios';
import { Sponsor, SponsorCreate } from '../schemas/Sponsor';

const baseURL = 'http://localhost:3001/sponsors';

export const getSponsors = async (): Promise<Sponsor[]> => {
  try {
    const { data } = await axios.get(baseURL);
    return data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'Error al obtener sponsors');
  }
};

export const createSponsor = async (
  sponsorData: SponsorCreate, // solo los datos para crear
  token: string
): Promise<Sponsor> => {
  try {
    const { data } = await axios.post(baseURL, sponsorData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'Error al crear sponsor');
  }
};

export const updateSponsor = async (
  id: string,
  sponsorData: Partial<SponsorCreate>, // actualización puede ser parcial
  token: string
): Promise<Sponsor> => {
  try {
    const { data } = await axios.patch(`${baseURL}/${id}`, sponsorData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'Error al actualizar sponsor');
  }
};

export const deleteSponsor = async (id: string, token: string): Promise<void> => {
  try {
    await axios.delete(`${baseURL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (err: any) {
    throw new Error(err.response?.data?.message || 'Error al eliminar sponsor');
  }
};
