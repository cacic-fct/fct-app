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
  getAllEvents(
    @Param('afterDate') afterDate: string,
    @Param('beforeDate') beforeDate: string,
  ) {}
  @Post('') createEvent(@Query('eventData') eventData: string) {}

  @Get(':majorEventId') getEvent(@Query('majorEventId') majorEventId: string) {}
  @Patch(':majorEventId') updateEvent(
    @Query('majorEventId') majorEventId: string,
  ) {}
  @Delete(':majorEventId') deleteEvent(
    @Query('majorEventId') majorEventId: string,
  ) {}
}
