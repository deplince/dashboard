import { Controller, Post, Body, Delete, Param, Get } from '@nestjs/common';
import { CreateRecordRequest, RecordDataResponse } from './dto';
import { RecordService } from './record.service';
import { DeleteRecordResponse } from './dto/delete-record.response';
import { PaginationQuery, PaginationResponse } from 'libs/common/dto';

@Controller('records')
export class RecordController {
  constructor(private readonly service: RecordService) {}

  @Post('/')
  async createRecord(
    @Body() dto: CreateRecordRequest,
  ): Promise<RecordDataResponse> {
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
  ): Promise<PaginationResponse<RecordDataResponse>> {
    return this.service.getAllRecords(pagination);
  }

  @Get('/:id')
  async getOneRecord(@Param('id') id: string): Promise<RecordDataResponse> {
    return this.getOneRecord(id);
  }
}
