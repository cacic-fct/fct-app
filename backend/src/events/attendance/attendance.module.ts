import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';

@Module({
  controllers: [AttendanceController],
})
export class AttendanceModule {}
