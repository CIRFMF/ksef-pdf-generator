import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

export interface RequestWithId extends Request {
  id: string;
}

/**
 * Middleware logujący każde żądanie i odpowiedź
 * Dodaje unique ID do każdego żądania dla śledzenia
 */
export function requestLogger(req: any, res: Response, next: NextFunction) {
  // Wygeneruj unique ID dla żądania
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  req.id = requestId;

  const startTime = Date.now();
  const method = req.method;
  const url = req.originalUrl;
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  // Loguj przychodzące żądanie
  logger.info(`[REQ] ${method} ${url}`, {
    requestId,
    ip,
    userAgent: req.get('user-agent'),
    contentLength: req.get('content-length') || 'N/A'
  });

  // Przechwyć oryginalną funkcję res.send
  const originalSend = res.send;
  res.send = function(data: any) {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    // Loguj odpowiedź
    logger.info(`[RES] ${statusCode} ${method} ${url} (${duration}ms)`, {
      requestId,
      duration,
      statusCode
    });

    // Jeśli to błąd, loguj dodatkowe szczegóły
    if (statusCode >= 400) {
      logger.warn(`Error response for ${method} ${url}`, {
        requestId,
        statusCode,
        responseSize: data?.length || 0
      });
    }

    // Wywołaj oryginalną funkcję
    return originalSend.call(this, data);
  };

  next();
}

/**
 * Middleware do obsługi wyjątków
 * Musi być ostatnim middleware w aplikacji
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  const requestId = (req as RequestWithId).id || 'unknown';
  const method = req.method;
  const url = req.originalUrl;

  // Loguj błąd
  logger.error(`[ERROR] ${method} ${url}`, {
    requestId,
    error: err.message,
    stack: err.stack,
    statusCode: err.statusCode || 500
  });

  // Odpowiedź z błędem
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message,
    requestId,
    timestamp: new Date().toISOString()
  });
}

/**
 * Middleware do obsługi niestnalez tras (404)
 */
export function notFoundHandler(req: Request, res: Response) {
  const requestId = (req as RequestWithId).id || 'unknown';
  const method = req.method;
  const url = req.originalUrl;

  logger.warn(`[404] Route not found: ${method} ${url}`, {
    requestId,
    ip: req.ip
  });

  res.status(404).json({
    error: 'Route not found',
    requestId,
    timestamp: new Date().toISOString()
  });
}
