import {
  Body,
  Controller,
  FileTypeValidator,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { Express } from 'express';
import { storage } from './utils/storage';
import { FilePipe } from './pipe/file.pipe';

@Controller('upload')
export class UploadController {
  // 单文件上传
  /**
   *
   * @param file 提供保存文件的HTML表单中字段的名称
   */
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads', // 文件存储位置
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
        errorHttpStatusCode: HttpStatus.BAD_REQUEST, // 错误状态码
        exceptionFactory: (err) => {
          throw new HttpException(`${err}`, 404);
        },
      }),
    )
    file: Express.Multer.File,
    @Body() body,
  ) {
    console.log('file', file);
    console.log('body', body);
  }

  // 多文件上传
  @Post('multiple')
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      dest: 'uploads/multiple',
    }),
  )
  uploadsFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
  }

  // 多字段
  @Post('multifield')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'avatar', maxCount: 1 },
        { name: 'life', maxCount: 4 },
      ],
      {
        dest: 'uploads/multifield',
      },
    ),
  )
  uploadsFileFields(
    @UploadedFiles()
    files: {
      avatar: Express.Multer.File[];
      life: Express.Multer.File[];
    },
    @Body() body,
  ) {
    console.log('files => ', files);
    console.log('body => ', body);
  }

  // 任意文件 不知道文件字段
  // AnyFilesInterceptor()
  @Post('anyMultiple')
  @UseInterceptors(
    AnyFilesInterceptor({
      // dest: 'uploads/anyMultiple',
      storage: storage,
    }),
  )
  uploadAnyFile(
    @UploadedFiles(FilePipe) files: Array<Express.Multer.File>,
    @Body() body,
  ) {
    console.log('files => ', files);
    console.log('body => ', body);
  }
}
