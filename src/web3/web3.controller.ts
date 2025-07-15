import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { Web3Service } from './web3.service';
import { LatestBlockDto } from './dto/latest-block.dto';
import { LatestBlockhashDto } from './dto/latest-blockhash.dto';
import { MintNftDto } from './dto/mint-nft.dto';

@ApiTags('web3')
@Controller('web3')
export class Web3Controller {
  constructor(private readonly web3Service: Web3Service) {}

  @Get('latest-block')
  @ApiOperation({ 
    summary: 'Get latest block information',
    description: 'Retrieves the latest block from the Solana blockchain including transactions and metadata'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved latest block information',
    type: LatestBlockDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error - failed to retrieve block information' 
  })
  async getLatestBlock(): Promise<LatestBlockDto> {
    return await this.web3Service.getLatestBlock();
  }

  @Get('latest-blockhash')
  @ApiOperation({ 
    summary: 'Get latest blockhash',
    description: 'Retrieves the latest blockhash from the Solana blockchain, used for transaction processing'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Successfully retrieved latest blockhash',
    type: LatestBlockhashDto
  })
  @ApiResponse({ 
    status: 500, 
    description: 'Internal server error - failed to retrieve blockhash' 
  })
  async getLatestBlockhash(): Promise<LatestBlockhashDto> {
    return await this.web3Service.getLatestBlockhash();
  }
}