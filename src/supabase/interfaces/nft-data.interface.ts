export interface NftData {
  id: number;
  inserted_at: string;
  updated_at: string;
  nft_address: string | null;
  minted: boolean;
  nft_type: string | null;
}
