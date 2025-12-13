import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';
import { RecordRepository } from './provider/record.repository';
import { RecordAdapter } from './provider/record.adapter';
import { Record } from '@libs/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Record])],
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
