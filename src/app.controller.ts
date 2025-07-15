import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('increment-transaction')
  @ApiOperation({ summary: 'Increment transaction count for user and merchant' })
  @ApiBody({
    description: 'User and merchant wallet addresses with transaction ID',
    schema: {
      type: 'object',
      properties: {
        userAddress: {
          type: 'string',
          description: 'User wallet address'
        },
        merchantAddress: {
          type: 'string',
          description: 'Merchant wallet address'
        },
        transactionId: {
          type: 'string',
          description: 'Transaction ID of the completed transaction'
        }
      },
      required: ['userAddress', 'merchantAddress', 'transactionId']
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Transaction incremented successfully',
    schema: {
      type: 'object',
      properties: {
        transactionId: {
          type: 'string',
          description: 'Transaction ID'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request - Old Transaction or invalid parameters'
  })
  async incrementTransaction(
    @Body() body: { userAddress: string; merchantAddress: string; transactionId: string }
  ): Promise<{ transactionId: string }> {
    const { userAddress, merchantAddress, transactionId } = body;
    const newTransactionId = await this.appService.incrementTxCount(userAddress, merchantAddress, transactionId);
    return { transactionId: newTransactionId };
  }

  @Post('mint-nft')
  @ApiOperation({ summary: 'Mint NFT for eligible merchant' })
  @ApiBody({
    description: 'Merchant address and NFT type',
    schema: {
      type: 'object',
      properties: {
        merchantAddress: {
          type: 'string',
          description: 'Merchant wallet address'
        },
        nftType: {
          type: 'string',
          enum: ['verified', 'og'],
          description: 'Type of NFT to mint (verified or og)'
        }
      },
      required: ['merchantAddress', 'nftType']
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'NFT minted successfully',
    schema: {
      type: 'object',
      properties: {
        transactionId: {
          type: 'string',
          description: 'Transaction ID'
        },
        nftType: {
          type: 'string',
          description: 'Type of NFT minted'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Not eligible to mint NFT'
  })
  async mintNft(
    @Body() body: { merchantAddress: string; nftType: 'verified' | 'og' }
  ): Promise<{ transactionId: string; nftType: string }> {
    const { merchantAddress, nftType } = body;
    const transactionId = await this.appService.mintNft(merchantAddress, nftType);
    return { transactionId, nftType };
  }
}
