import { Injectable } from '@nestjs/common';
import { AaaService } from './aaa/aaa.service';
import { BbbService } from './bbb/bbb.service';

@Injectable()
export class AppService {
  constructor(
    private readonly aaa: AaaService,
    private readonly bbb: BbbService,
  ) {}
  getHello(): string {
    return this.aaa.both() + this.bbb.myB();
    // return 'Hello World!';
  }
}
