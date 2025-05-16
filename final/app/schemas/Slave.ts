// app/schemas/Slave.ts

export enum Status {
  ALIVE = 'alive',
  DEAD = 'dead',
  ESCAPED = 'escaped',
  FREE = 'free',
}

export default interface Slave {
  id: string; // asumimos que tu backend agrega un ID
  name: string;
  nickname: string;
  origin: string;
  strength: number;
  agility: number;
  wins: number;
  losses: number;
  status: Status;
}
