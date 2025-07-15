import { Injectable, OnModuleInit, BadRequestException } from '@nestjs/common';
import { Connection, clusterApiUrl, PublicKey, Keypair } from '@solana/web3.js';
import { AnchorProvider, Wallet, Program } from '@project-serum/anchor';
import bs58 from 'bs58';
import { LatestBlockDto } from './dto/latest-block.dto';
import { LatestBlockhashDto } from './dto/latest-blockhash.dto';

// Import IDL
import * as idl from './idl/idl.json';

@Injectable()
export class Web3Service implements OnModuleInit {
  private connection: Connection;
  private program: Program;
  private ownerSigner: Keypair;
  private programId: PublicKey;

  async onModuleInit() {
    const devnetRpcUrl = clusterApiUrl('devnet');
    this.connection = new Connection(devnetRpcUrl, 'confirmed');
    
    console.log('Solana connection initialized with devnet RPC endpoint:', devnetRpcUrl);
    try {
      const version = await this.connection.getVersion();
      console.log('Solana devnet version:', version);
    } catch (error) {
      console.error('Failed to connect to Solana devnet:', error);
    }

    // Initialize program ID
    if (!process.env.CONTRACT_PUBKEY) {
      throw new Error('CONTRACT_PUBKEY environment variable is required');
    }
    this.programId = new PublicKey(process.env.CONTRACT_PUBKEY);
    
    // Initialize owner signer from private key
    if (!process.env.PRIVATE_KEY) {
      throw new Error('PRIVATE_KEY environment variable is required');
    }
    const privateKeyBytes = bs58.decode(process.env.PRIVATE_KEY);
    this.ownerSigner = Keypair.fromSecretKey(privateKeyBytes);
    
    // Initialize anchor provider and program
    const wallet = new Wallet(this.ownerSigner);
    const provider = new AnchorProvider(this.connection, wallet, {});
    this.program = new Program(idl as any, this.programId, provider);
  }

  /**
   * Get the Solana connection instance
   */
  getConnection(): Connection {
    return this.connection;
  }

  /**
   * Get the latest blockhash
   */
  async getLatestBlockhash(): Promise<LatestBlockhashDto> {
    const result = await this.connection.getLatestBlockhash();
    return {
      blockhash: result.blockhash,
      lastValidBlockHeight: result.lastValidBlockHeight
    };
  }

  /**
   * Get the latest block information
   */
  async getLatestBlock(): Promise<LatestBlockDto> {
    const slot = await this.connection.getSlot();
    const block = await this.connection.getBlock(slot, {
      maxSupportedTransactionVersion: 0
    });
    
    if (!block) {
      throw new Error('Failed to retrieve block information');
    }
    
    return {
      blockhash: block.blockhash,
      blockTime: block.blockTime,
      parentSlot: block.parentSlot,
      previousBlockhash: block.previousBlockhash,
      transactions: block.transactions || [],
      slot: slot
    };
  }

  /**
   * Get the Anchor program instance
   */
  getProgram(): Program {
    return this.program;
  }

  /**
   * Get the owner signer keypair
   */
  getOwnerSigner(): Keypair {
    return this.ownerSigner;
  }

  /**
   * Get the program ID
   */
  getProgramId(): PublicKey {
    return this.programId;
  }

  /**
   * Fetch contract owner PDA
   */
  async fetchContractOwnerPDA(): Promise<{ contractOwnerPDA: PublicKey; bump: number }> {
    try {
      const [contractOwnerPDA, bump] = await PublicKey.findProgramAddress(
        [Buffer.from("contract_owner")],
        this.programId
      );
      console.log("Contract Owner PDA:", contractOwnerPDA.toString());
      return { contractOwnerPDA, bump };
    } catch (error) {
      console.error("Error fetching contract owner PDA:", error);
      throw error;
    }
  }

  /**
   * Fetch merchant PDA
   */
  async fetchMerchantPDA(merchantWallet: string): Promise<{ merchantPDA: PublicKey; bump: number }> {
    try {
      const merchant = new PublicKey(merchantWallet);

      const [merchantPDA, bump] = await PublicKey.findProgramAddress(
        [
          Buffer.from("merchant"),
          merchant.toBuffer()
        ],
        this.programId
      );
      console.log("Merchant Wallet:", merchant.toString());
      console.log("Merchant PDA:", merchantPDA.toString());      
      return { merchantPDA, bump };
    } catch (error) {
      console.error("Error fetching merchant PDA:", error);
      throw error;
    }
  }

  /**
   * Fetch user PDA
   */
  async fetchUserPDA(userWallet: string): Promise<{ userPDA: PublicKey; bump: number }> {
    try {
      const user = new PublicKey(userWallet);

      const [userPDA, bump] = await PublicKey.findProgramAddress(
        [
          Buffer.from("user"),
          user.toBuffer()
        ],
        this.programId
      );
      console.log("User Wallet:", user.toString());
      console.log("User PDA:", userPDA.toString());      
      return { userPDA, bump };
    } catch (error) {
      console.error("Error fetching user PDA:", error);
      throw error;
    }
  }

  /**
   * Increment transaction count
   */
  async incrementTxCount(userAddress: string, merchantAddress: string, transactionId: string): Promise<string> {
    if (!userAddress || !merchantAddress || !transactionId) {
      throw new BadRequestException('User address, merchant address, and transaction ID are required');
    }
    
    console.log("-------------------------------------------------------------------");
    console.log("-------------------------------------------------------------------");
    console.log("Incrementing transaction count for user:", userAddress, "and merchant:", merchantAddress);
    console.log("Validating transaction ID:", transactionId);
    
    try {
      // Validate transaction timestamp
      await this.validateTransactionTimestamp(transactionId);
      
      // Calculate PDAs
      const { userPDA } = await this.fetchUserPDA(userAddress);
      const { merchantPDA } = await this.fetchMerchantPDA(merchantAddress);
      const { contractOwnerPDA } = await this.fetchContractOwnerPDA();

      // Call the increment_tx_count function
      const tx = await this.program.methods
        .incrementTxCount()
        .accounts({
          merchantAccount: merchantPDA,
          userAccount: userPDA,
          contractOwnerAccount: contractOwnerPDA,
          ownerSigner: this.ownerSigner.publicKey,
        })
        .signers([this.ownerSigner])
        .rpc();

      console.log("Transaction ID:", tx);
      return tx;
    } catch (error) {
      console.error("Error incrementing transaction count:", error);
      throw error;
    }
  }

  /**
   * Mint NFT for eligible merchant
   */
  async mintNft(merchantAddress: string, nftType: 'verified' | 'og'): Promise<string> {
    if (!merchantAddress || !nftType) {
      throw new BadRequestException('Merchant address and NFT type are required');
    }
    
    if (nftType !== 'verified' && nftType !== 'og') {
      throw new BadRequestException('Invalid NFT type. Must be either "verified" or "og"');
    }
    
    console.log("-------------------------------------------------------------------");
    console.log("-------------------------------------------------------------------");
    console.log("Minting NFT for merchant:", merchantAddress, "NFT type:", nftType);
    
    try {
      // Calculate PDAs
      const { merchantPDA } = await this.fetchMerchantPDA(merchantAddress);
      const { contractOwnerPDA } = await this.fetchContractOwnerPDA();

      // Fetch merchant account to check badge eligibility
      const merchantAccount = await this.program.account.merchantAccount.fetch(merchantPDA);
      console.log("Merchant account:", merchantAccount);

      // Check eligibility based on NFT type
      if (nftType === 'verified') {
        if (!merchantAccount.verifiedBadge) {
          throw new BadRequestException('Not eligible to mint NFT: Merchant does not have verified badge');
        }
        if (merchantAccount.verifiedNftMinted) {
          throw new BadRequestException('Not eligible to mint NFT: Verified NFT already minted');
        }
      } else if (nftType === 'og') {
        if (!merchantAccount.ogBadge) {
          throw new BadRequestException('Not eligible to mint NFT: Merchant does not have OG badge');
        }
        if (merchantAccount.ogNftMinted) {
          throw new BadRequestException('Not eligible to mint NFT: OG NFT already minted');
        }
      }

      // Update merchant NFT status
      const verifiedNftMinted = nftType === 'verified' ? true : merchantAccount.verifiedNftMinted;
      const ogNftMinted = nftType === 'og' ? true : merchantAccount.ogNftMinted;

      const tx = await this.program.methods
        .updateMerchantNftStatus(verifiedNftMinted, ogNftMinted)
        .accounts({
          merchantAccount: merchantPDA,
          contractOwnerAccount: contractOwnerPDA,
          ownerSigner: this.ownerSigner.publicKey,
        })
        .signers([this.ownerSigner])
        .rpc();

      console.log("NFT minted successfully. Transaction ID:", tx);
      return tx;
    } catch (error) {
      console.error("Error minting NFT:", error);
      throw error;
    }
  }

  /**
   * Validate transaction timestamp to ensure it's not older than 10 seconds
   */
  async validateTransactionTimestamp(transactionId: string): Promise<void> {
    try {
      const transaction = await this.connection.getTransaction(transactionId, {
        maxSupportedTransactionVersion: 0
      });
      
      if (!transaction) {
        throw new BadRequestException('Transaction not found');
      }
      
      if (!transaction.blockTime) {
        throw new BadRequestException('Transaction block time not available');
      }
      
      const transactionTime = transaction.blockTime * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeDifference = currentTime - transactionTime;
      
      // Check if transaction is older than 1 hour (3600000 milliseconds)
      if (timeDifference > 3600000) {
        throw new BadRequestException('Old Transaction');
      }
      
      console.log("Transaction validation successful. Age:", timeDifference, "ms");
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error("Error validating transaction timestamp:", error);
      throw new BadRequestException('Failed to validate transaction');
    }
  }
}
