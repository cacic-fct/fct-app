import { Module } from '@nestjs/common';
import { MajorEventCertificatesController } from './major-event-certificates.controller';
import { MajorEventCertificatesTemplatesController } from './major-event-certificates-templates/major-event-certificates-templates.controller';
import { IssuedMajorEventCertificatesController } from './issued-major-event-certificates/issued-major-event-certificates.controller';

@Module({
  controllers: [
    MajorEventCertificatesController,
    MajorEventCertificatesTemplatesController,
    IssuedMajorEventCertificatesController,
  ],
})
export class MajorEventCertificatesModule {}
