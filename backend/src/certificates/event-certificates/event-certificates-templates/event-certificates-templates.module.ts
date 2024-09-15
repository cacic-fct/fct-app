import { Module } from '@nestjs/common';
import { EventCertificatesTemplatesController } from './event-certificates-templates.controller';

@Module({
  controllers: [EventCertificatesTemplatesController]
})
export class EventCertificatesTemplatesModule {}
