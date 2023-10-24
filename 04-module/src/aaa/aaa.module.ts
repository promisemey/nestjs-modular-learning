import { Module, forwardRef } from '@nestjs/common';
import { BbbModule } from 'src/bbb/bbb.module';
import { AaaService } from './aaa.service';

@Module({
  //   imports: [BbbModule], // 产生循环依赖
  imports: [forwardRef(() => BbbModule)],
  providers: [AaaService], // 产生循环依赖
  exports: [AaaService],
})
export class AaaModule {}
