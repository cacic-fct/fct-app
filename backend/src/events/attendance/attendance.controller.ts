import { Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('events/{eventId}/attendance')
@Controller('/events/:eventId/attendance')
export class AttendanceController {
  @Get('')
  getAttendances() {}

  @Post('') writeAttendance(@Query('attendanceData') attendanceData: string) {}

  @Delete('') deleteAttendance(@Query('userId') userId: string) {}
}
