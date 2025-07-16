import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { NftData } from './interfaces/nft-data.interface';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration. Please check SUPABASE_URL and SUPABASE_SERVICE_KEY in your .env file');
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceKey);
  }

  /**
   * Get NFT address from the database where minted is false and nft_type matches the parameter
   * @param nftType - The type of NFT to filter by
   * @returns Promise<string> - NFT address
   * @throws Error if no row is found or if there's any database error
   */
  async getUnmintedNftDataByType(nftType: string): Promise<string> {
    try {
      const { data, error } = await this.supabase
        .from('nft_data')
        .select('nft_address')
        .eq('minted', false)
        .eq('nft_type', nftType)
        .limit(1);

      if (error) {
        throw new Error(`Error fetching NFT data: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error(`No unminted NFT found for type: ${nftType}`);
      }

      return data[0].nft_address;
    } catch (error) {
      throw new Error(`Failed to fetch unminted NFT data: ${error.message}`);
    }
  }

  /**
   * Update NFT status to minted in the database
   * @param nftAddress - The NFT address to update
   * @returns Promise<void>
   * @throws Error if update fails
   */
  async markNftAsMinted(nftAddress: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('nft_data')
        .update({ minted: true })
        .eq('nft_address', nftAddress);

      if (error) {
        throw new Error(`Error updating NFT status: ${error.message}`);
      }

      console.log(`NFT ${nftAddress} marked as minted in database`);
    } catch (error) {
      throw new Error(`Failed to mark NFT as minted: ${error.message}`);
    }
  }
}
