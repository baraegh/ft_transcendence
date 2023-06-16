import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class Midlewareofcookies implements NestMiddleware {
  use(req: Request, res: Response, next: () => any) {
    // const authCookie = req.cookies['access_token'];
    // if (authCookie) {
    //   Object.defineProperty(req, 'token', {
    //     value: `Bearer ${authCookie}`,
    //     writable: true,
    //     enumerable: true,
    //     configurable: true,
    //   });
    // }
    next();
  }
}