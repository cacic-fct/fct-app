import { Module } from '@nestjs/common';
import { EventCertificatesController } from './event-certificates.controller';
import { EventCertificatesTemplatesModule } from './event-certificates-templates/event-certificates-templates.module';
import { IssuedEventCertificatesController } from './issued-event-certificates/issued-event-certificates.controller';

@Module({
  controllers: [EventCertificatesController, IssuedEventCertificatesController],
  imports: [EventCertificatesTemplatesModule],
})
export class EventCertificatesModule {}
