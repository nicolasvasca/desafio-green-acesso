import {
  Controller,
  HttpStatus,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilesService } from '../../aplication/services/files.service';
import { BaseBillDto } from '../dtos/bills/base-bill.dto';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('/bills')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Envio de um arquivo csv para criação de boletos e lotes, somente o primeiro arquivo será lido',
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: [BaseBillDto],
    description: 'Boletos criados com sucesso.',
  })
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<BaseBillDto[]> {
    const file = files[0];
    return this.filesService.processCsvFile(file);
  }
}
