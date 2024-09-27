import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('major-events')
@Controller('major-events')
export class MajorEventsController {
  @Get('')
  @ApiQuery({
    name: 'afterDate',
    type: String,
    description: 'Inclusivo. Data em formato ISO',
    required: true,
  })
  @ApiQuery({
    name: 'beforeDate',
    type: String,
    description: 'Inclusivo. Data em formato ISO',
    required: false,
  })
  getAllMajorEvents(
    @Param('afterDate') afterDate: string,
    @Param('beforeDate') beforeDate: string,
  ) {}
  @Post('') createMajorEvent(@Query('eventData') eventData: string) {}

  @Get(':majorEventId') getMajorEvent(
    @Query('majorEventId') majorEventId: string,
  ) {}
  @Patch(':majorEventId') updateMajorEvent(
    @Query('majorEventId') majorEventId: string,
  ) {}
  @Delete(':majorEventId') deleteMajorEvent(
    @Query('majorEventId') majorEventId: string,
  ) {}

  @Get(':majorEventId/events') getEventsInMajorEvent(
    @Query('majorEventId') majorEventId: string,
  ) {}
}
