import * as fs from 'fs';

import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FilePipe implements PipeTransform {
  // @Inject()

  transform(value: Array<Express.Multer.File>, metadata: ArgumentMetadata) {
    const types = Object.prototype.toString.call(value).slice(8, -1);

    if (types === 'Array') {
      value.forEach((file, index) => {
        const sizeValue = Reflect.has(file, 'size')
          ? Reflect.get(file, 'size')
          : '';
        // 禁止上传大于1M文件
        if (+sizeValue > 1024 * 1024) {
          fs.unlinkSync(file.path); // 删除未效验通过文件
          throw new HttpException(
            {
              statusCode: HttpStatus.BAD_REQUEST,
              fields: file.fieldname,
              filename: file.originalname,
              message: '文件大于1M',
            },
            // `${file.fieldname}文件大于1M`,
            HttpStatus.BAD_REQUEST,
            // {
            //   cause: new Error('文件大于1M'),
            // },
          );
        }
      });
    }

    return value;
  }
}
