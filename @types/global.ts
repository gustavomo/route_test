import { NextFunction, Request, Response } from 'express';

declare global {
  interface IObj {
    [key: string]: any;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IReq extends Request { }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IRes extends Response { }

  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface INext extends NextFunction { }
}
