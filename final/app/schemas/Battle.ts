
export interface SlaveMini {
  id: string;
  name: string;
  nickname?: string;
}

export interface Battle {
  id?: string;
  contestant_1: SlaveMini;
  contestant_2: SlaveMini;
  winner_id?: string;
  winner?: SlaveMini;
  injuries: string;
  date: string;
}

// Para crear batalla solo pasamos ids (strings)
export interface BattleCreate {
  contestant_1: string;
  contestant_2: string;
  winner_id?: string;
  injuries: string;
  date: string;
}
