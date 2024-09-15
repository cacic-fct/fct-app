import { Controller, Delete, Param } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('certificates/events/{eventId}')
@Controller('certificates/events')
export class EventCertificatesController {
  @Delete(':eventId/bulk-delete')
  @ApiOperation({
    summary: 'Deletar certificados em massa',
    description: 'Atualiza um template de certificado',
  })
  @ApiQuery({
    name: 'certificateTemplateName',
    description: 'Se não for fornecido, deleta todos os certificados',
    type: String,
    required: false,
  })
  bulkDeleteEventCertificates(
    @Param('certificateTemplateName') certificateTemplateName: string,
  ) {}
}
