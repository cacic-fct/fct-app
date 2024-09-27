import { Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('certificates/major-events/{majorEventId}/templates')
@Controller('certificates/major-events/:majorEventId/templates')
export class MajorEventCertificatesTemplatesController {
  @Get('')
  @ApiOperation({
    summary: 'Listar templates',
    description: 'Atualiza um template de certificado',
  })
  listMajorEventCertificateTemplates(
    @Query('majorEventId') majorEventId: string,
    @Query('certificateId') certificateTemplateName: string,
  ) {}

  @Get(':certificateTemplateName')
  @ApiOperation({
    summary: 'Obter template',
    description: 'Atualiza um template de certificado',
  })
  getMajorEventCertificateTemplate(
    @Query('majorEventId') majorEventId: string,
    @Query('certificateId') certificateTemplateName: string,
  ) {}

  @Post(':certificateTemplateName')
  @ApiOperation({
    summary: 'Criar template',
    description: 'Atualiza um template de certificado',
  })
  createMajorEventCertificateTemplate(
    @Query('majorEventId') majorEventId: string,
    @Query('certificateId') certificateTemplateName: string,
  ) {}

  @Patch(':certificateTemplateName')
  @ApiOperation({
    summary: 'Atualizar template',
    description: 'Atualiza um template de certificado',
  })
  patchMajorEventCertificateTemplate(
    @Query('majorEventId') majorEventId: string,
    @Query('certificateId') certificateTemplateName: string,
  ) {}

  @Delete(':certificateTemplateName')
  @ApiOperation({
    summary: 'Deletar template',
    description: 'Deleta um template de certificado de evento',
  })
  deleteMajorEventCertificateTemplate(
    @Query('certificateId') certificateId: string,
  ) {}
}
