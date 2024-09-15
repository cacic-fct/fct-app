import { Module } from '@nestjs/common';
import { CertificatesController } from './certificates.controller';
import { EventCertificatesModule } from 'src/certificates/event-certificates/event-certificates.module';

@Module({
  controllers: [CertificatesController],
  imports: [EventCertificatesModule],
})
export class CertificatesModule {}
