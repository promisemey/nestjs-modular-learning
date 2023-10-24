import { Module, forwardRef } from '@nestjs/common';
import { AaaModule } from 'src/aaa/aaa.module';
import { BbbService } from './bbb.service';

@Module({
  //   imports: [AaaModule],
  // nest 会先创建 Module、Provider，之后再把引用转发到对方，也就是 forwardref。
  imports: [forwardRef(() => AaaModule)],
  providers: [BbbService],
  exports: [BbbService],
})
export class BbbModule {}
