import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { AaaService } from 'src/aaa/aaa.service';

@Injectable()
export class BbbService {
  //   @Inject(AaaService)
  @Inject(forwardRef(() => AaaService))
  private readonly aaa: AaaService;

  myB() {
    return this.aaa.myA() + 'B文件';
  }
}
