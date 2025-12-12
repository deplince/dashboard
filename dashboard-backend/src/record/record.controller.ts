import { Controller, Post, Body, Delete, Param, Get } from '@nestjs/common';
import { CreateRecordRequest } from './dto';
import { RecordAggregate } from './domain';
import { RecordService } from './record.service';
import { DeleteRecordResponse } from './dto/delete-record.response';
import { PaginationQuery, PaginationResponse } from 'libs/common/dto';

@Controller('records')
export class RecordController {
  constructor(private readonly service: RecordService) {}

  @Post('/')
  async createRecord(
    @Body() dto: CreateRecordRequest,
  ): Promise<RecordAggregate> {
    return this.service.createRecord(dto);
  }

  @Delete('/:id')
  async deleteRecord(@Param('id') id: string): Promise<DeleteRecordResponse> {
    const success = await this.service.deleteRecord(id);
    if (!success) {
      return { message: 'Record removed successfully' };
    }
    return { message: 'Record removing failed' };
  }

  @Get('/')
  async getAllRecords(
    pagination: PaginationQuery,
  ): Promise<PaginationResponse<RecordAggregate>> {
    return this.service.getAllRecords(pagination);
  }

  @Get('/:id')
  async getOneRecord(@Param('id') id: string): Promise<RecordAggregate> {
    return this.getOneRecord(id);
  }
}
