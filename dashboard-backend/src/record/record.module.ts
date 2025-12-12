import { Module } from '@nestjs/common';
import { RecordService } from './record.service';

@Module({
  providers: [RecordService]
})
export class RecordModule {}
