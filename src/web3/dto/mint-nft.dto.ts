import { ApiProperty } from '@nestjs/swagger';

export class MintNftDto {
  @ApiProperty({
    description: 'Merchant wallet address (Public Key)',
    example: 'ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZ'
  })
  merchantAddress: string;

  @ApiProperty({
    description: 'Type of NFT to mint',
    enum: ['verified', 'og'],
    example: 'verified'
  })
  nftType: 'verified' | 'og';
}
