import { Module } from '@nestjs/common';
import { Web3Service } from './web3.service';
import { Web3Controller } from './web3.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [Web3Controller],
  providers: [Web3Service],
  exports: [Web3Service]
})
export class Web3Module {}
