import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { appendFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');
  private readonly logFilePath = join(process.cwd(), 'logs', 'requests.log');
  private readonly sensitiveKeys = new Set([
    'password',
    'passwordHash',
    'token',
    'accessToken',
    'refreshToken',
    'authorization',
    'cookie',
  ]);

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - startTime;
      const userId = (req as any).user?.userId || 'anonymous';
      const logEntry = {
        timestamp: new Date().toISOString(),
        method,
        url: originalUrl,
        statusCode,
        durationMs: duration,
        ip: req.ip,
        userId,
        params: req.params,
        body: this.sanitizeForLogging(req.body),
      };

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${duration}ms - User: ${userId}`,
      );

      void this.writeLogEntry(logEntry);
    });

    next();
  }

  private async writeLogEntry(logEntry: {
    timestamp: string;
    method: string;
    url: string;
    statusCode: number;
    durationMs: number;
    ip?: string;
    userId: string;
  }) {
    try {
      await mkdir(dirname(this.logFilePath), { recursive: true });
      await appendFile(this.logFilePath, `${JSON.stringify(logEntry)}\n`, 'utf8');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown file logging error';
      this.logger.error(`Failed to write request log file: ${message}`);
    }
  }

  private sanitizeForLogging(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.map((item) => this.sanitizeForLogging(item));
    }

    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([key, nestedValue]) => {
          if (this.sensitiveKeys.has(key)) {
            return [key, '[REDACTED]'];
          }

          return [key, this.sanitizeForLogging(nestedValue)];
        }),
      );
    }

    return value;
  }
}
