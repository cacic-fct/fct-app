import { Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('certificates/events/{eventId}/templates')
@Controller('certificates/events/:eventId/templates')
export class EventCertificatesTemplatesController {
  @Get('')
  @ApiOperation({
    summary: 'Listar templates',
    description: 'Atualiza um template de certificado',
  })
  listEventCertificateTemplates(
    @Query('eventId') eventId: string,
    @Query('certificateId') certificateTemplateName: string,
  ) {}

  @Get(':certificateTemplateName')
  @ApiOperation({
    summary: 'Obter template',
    description: 'Atualiza um template de certificado',
  })
  getEventCertificateTemplate(
    @Query('eventId') eventId: string,
    @Query('certificateId') certificateTemplateName: string,
  ) {}

  @Post(':certificateTemplateName')
  @ApiOperation({
    summary: 'Criar template',
    description: 'Atualiza um template de certificado',
  })
  createEventCertificateTemplate(
    @Query('eventId') eventId: string,
    @Query('certificateId') certificateTemplateName: string,
  ) {}

  @Patch(':certificateTemplateName')
  @ApiOperation({
    summary: 'Atualizar template',
    description: 'Atualiza um template de certificado',
  })
  patchEventCertificateTemplate(
    @Query('eventId') eventId: string,
    @Query('certificateId') certificateTemplateName: string,
  ) {}

  @Delete(':certificateTemplateName')
  @ApiOperation({
    summary: 'Deletar template',
    description: 'Deleta um template de certificado de evento',
  })
  deleteEventCertificateTemplate(
    @Query('certificateId') certificateId: string,
  ) {}
}
