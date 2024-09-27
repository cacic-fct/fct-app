import { Module } from '@nestjs/common';
import { CertificatesController } from './certificates.controller';
import { EventCertificatesModule } from 'src/certificates/event-certificates/event-certificates.module';
import { MajorEventCertificatesModule } from './major-event-certificates/major-event-certificates.module';

@Module({
  controllers: [CertificatesController],
  imports: [EventCertificatesModule, MajorEventCertificatesModule],
})
export class CertificatesModule {}
