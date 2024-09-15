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

@ApiTags('certificates')
@Controller('certificates')
export class CertificatesController {
  @Get('verify')
  @ApiOperation({
    summary: 'Verificar autenticidade',
    description: 'Obtém todos os templates',
  })
  verifyCertificate(@Query('eventId') eventId: string) {}
}
