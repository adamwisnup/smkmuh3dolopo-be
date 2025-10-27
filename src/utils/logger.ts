import { Logger } from '@nestjs/common';

export class AppLogger {
  private readonly logger: Logger;

  constructor(context: string) {
    this.logger = new Logger(context);
  }

  log(message: string, meta?: any) {
    this.logger.log(meta ? `${message} - ${JSON.stringify(meta)}` : message);
  }

  error(message: string, trace?: any) {
    this.logger.error(message, trace);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }
}
