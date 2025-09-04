import { BadRequestException, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ClientesService } from './clientes.service';
import { ClientesController } from './clientes.controller';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
    ConfigModule,
    MulterModule.register({
      fileFilter: (req, file, callback) => {
        // Obter tipos de arquivo permitidos do .env (padrão: jpg|jpeg|png)
        const allowedFileTypes = process.env.ALLOWED_FILE_TYPES || 'jpg|jpeg|png|pdf';
        const fileTypeRegex = new RegExp(`\\/(${allowedFileTypes})$`);

        // Verificar se o arquivo é de um tipo permitido
        if (!file.mimetype.match(fileTypeRegex)) {
          const allowedTypesFormatted = allowedFileTypes.split('|').join(', .');
          return callback(
            new BadRequestException([`Somente arquivos dos seguintes tipos são permitidos: .${allowedTypesFormatted}`]),
            false,
          );
        }
        callback(null, true);
      },
      storage: diskStorage({
        destination: './uploads/clientes',
        filename: (req, file, callback) => {
          const uniqueSuffix = uuidv4();
          const fileExtName = extname(file.originalname);
          callback(null, `${uniqueSuffix}${fileExtName}`);
        },
      }),
      limits: {
        // Obter limite de tamanho do arquivo do .env (padrão: 50 MB)
        fileSize: (parseInt(process.env.MAX_FILE_SIZE || '50')) * 1024 * 1024,
      },
    }),
  ],
  controllers: [ClientesController],
  providers: [ClientesService],
})
export class ClientesModule { }
