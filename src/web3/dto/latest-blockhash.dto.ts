import { ApiProperty } from '@nestjs/swagger';

export class LatestBlockhashDto {
  @ApiProperty({
    description: 'The latest blockhash as a base58-encoded string',
    example: 'EkSnNWid2cvwEVnVx9aBqawnmiCNiDgp3gUdkDPTKN1N',
    type: String
  })
  blockhash: string;

  @ApiProperty({
    description: 'The last block height at which this blockhash will be valid',
    example: 123456900,
    type: Number
  })
  lastValidBlockHeight: number;
}
