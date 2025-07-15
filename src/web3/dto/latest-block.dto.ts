import { ApiProperty } from '@nestjs/swagger';

export class LatestBlockDto {
  @ApiProperty({
    description: 'The blockhash of this block',
    example: 'EkSnNWid2cvwEVnVx9aBqawnmiCNiDgp3gUdkDPTKN1N',
    type: String
  })
  blockhash: string;

  @ApiProperty({
    description: 'Unix timestamp of when the block was processed',
    example: 1642094400,
    type: Number,
    nullable: true
  })
  blockTime: number | null;

  @ApiProperty({
    description: 'The slot index of the parent block',
    example: 123456788,
    type: Number
  })
  parentSlot: number;

  @ApiProperty({
    description: 'The blockhash of the previous block',
    example: 'DhkUfKvSwABp5CvhMSLMdJEWdKiVYhPMvKQP5Q3vFY9g',
    type: String
  })
  previousBlockhash: string;

  @ApiProperty({
    description: 'Array of transactions in the block',
    type: 'array',
    items: {
      type: 'object',
      description: 'Transaction object containing transaction details'
    }
  })
  transactions: any[];

  @ApiProperty({
    description: 'The current slot number',
    example: 123456789,
    type: Number
  })
  slot: number;
}
