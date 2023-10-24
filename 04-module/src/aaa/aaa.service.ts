import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { BbbService } from 'src/bbb/bbb.service';

@Injectable()
export class AaaService {
  //   @Inject(BbbService)
  @Inject(forwardRef(() => BbbService))
  private readonly bbb: BbbService;

  myA() {
    return 'A文件';
  }

  both() {
    return this.bbb.myB() + `=> both`;
  }
}
