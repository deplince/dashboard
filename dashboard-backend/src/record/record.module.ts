import { Module } from '@nestjs/common';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';
import { RecordRepository } from './provider/record.repository';
import { RecordAdapter } from './provider/record.adapter';

@Module({
  providers: [
    {
      provide: RecordRepository,
      useClass: RecordAdapter,
    },
    RecordService,
  ],
  controllers: [RecordController],
})
export class RecordModule {}
