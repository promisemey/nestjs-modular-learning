import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

import { CoffeeService } from './coffee.service';

@Injectable()
export class CoffeeMiddleware implements NestMiddleware {
  constructor(private readonly coffeeService: CoffeeService) {}

  use(req: Request, res: Response, next: () => void) {
    console.log('before');
    console.log(this.coffeeService.findOne(1));
    next();
    console.log('after');
  }
}
