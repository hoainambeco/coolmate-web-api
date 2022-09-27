import { HttpException, HttpStatus } from '@nestjs/common';

export class ErrorException extends HttpException {
  constructor(code: HttpStatus, error: string) {
    super(
      {
        status: code,
        error: error,
      },
      code,
    );
  }
}
