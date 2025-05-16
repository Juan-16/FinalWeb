export type BlackMarketStatus = 'Completed' | 'Failed' | 'Discovered';

export interface DictatorMini {
  id: string;
  name: string;
}

export interface BlackMarketTransaction {
  id: string;
  buyer: DictatorMini;
  seller: DictatorMini;
  item: string;
  amount: number;
  status: BlackMarketStatus;
  isRansom?: boolean;
}

export interface BlackMarketTransactionCreate {
  buyerId: string;
  sellerId: string;
  item: string;
  amount: number;
  status: BlackMarketStatus;
  isRansom?: boolean;
}
