import { Injectable } from '@nestjs/common';
import { Web3Service } from './web3/web3.service';
import { PublicKey } from '@solana/web3.js';

@Injectable()
export class AppService {
  constructor(private readonly web3Service: Web3Service) {}

  getHello(): string {
    return 'Hello World!';
  }

  async incrementTxCount(userAddress: string, merchantAddress: string, transactionId: string): Promise<string> {
    return this.web3Service.incrementTxCount(userAddress, merchantAddress, transactionId);
  }

  async mintNft(merchantAddress: string, nftType: 'verified' | 'og'): Promise<string> {
    return this.web3Service.mintNft(merchantAddress, nftType);
  }
}
