import { Module } from '@nestjs/common';
import { EventCertificatesController } from './event-certificates.controller';

import { IssuedEventCertificatesController } from './issued-event-certificates/issued-event-certificates.controller';
import { EventCertificatesTemplatesController } from 'src/certificates/event-certificates/event-certificates-templates/event-certificates-templates.controller';

@Module({
  controllers: [
    EventCertificatesController,
    IssuedEventCertificatesController,
    EventCertificatesTemplatesController,
  ],
})
export class EventCertificatesModule {}
