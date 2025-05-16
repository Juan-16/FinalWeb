export interface Sponsor {
  id?: string;
  company_name: string;
  donated_items: string[];
  preferred_fighter: {
    id: string;
    name: string;
  } | null;
}

export interface SponsorCreate {
  company_name: string;
  donated_items: string[];
  preferred_fighter: string; // solo el id del luchador preferido
}