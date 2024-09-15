import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('certificates/events/{eventId}/issued-certificates')
@Controller('certificates/events/:eventId/issued-certificates')
export class IssuedEventCertificatesController {
  @Get('')
  @ApiOperation({
    summary: 'Listar certificados emitidos',
    description: 'Obtém todos os templates',
  })
  @ApiQuery({
    name: 'templateName',
    description: 'Se não for fornecido, retorna todos os certificados',
    type: String,
    required: false,
  })
  listEventCertificates(@Param('templateName') eventId: string) {}

  @Post('')
  @ApiOperation({
    summary: 'Emitir certificados',
    description: 'Obtém todos os templates',
  })
  @ApiQuery({
    name: 'issuingData',
    description: '',
    type: String,
    required: true,
  })
  issueEventCertificates(@Param('issuingData') eventId: string) {}

  @Get(':certificateId')
  @ApiOperation({
    summary: 'Obter um certificado específico',
    description: '',
  })
  getEventUserCertificate(@Query('certificateId') certificateId: string) {}

  @Patch(':certificateId')
  @ApiOperation({
    summary: 'Atualizar um certificado específico',
    description: '',
  })
  patchEventUserCertificate(@Query('certificateId') certificateId: string) {}

  @Delete(':certificateId')
  @ApiOperation({
    summary: 'Deletar um certificado específico',
    description: '',
  })
  deleteEventUserCertificate(@Query('certificateId') certificateId: string) {}
}
