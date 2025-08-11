/**
 * Authentication logging utility for Firebase and custom auth flows
 * Provides structured logging for authentication events, requests, and responses
 */

export interface AuthLogContext {
  operation: string;
  requestId?: string;
  userAgent?: string;
  ip?: string;
  url?: string;
}

export interface AuthEventDetails {
  apiKey?: string;
  oobCode?: string;
  mode?: string;
  lang?: string;
  email?: string;
  uid?: string;
  error?: string;
  statusCode?: number;
  timestamp?: string;
  // Additional logging fields
  [key: string]: string | number | boolean | undefined; // Allow additional properties for flexible logging
}

/**
 * Log authentication events with structured data
 */
export class AuthLogger {
  private static createTimestamp(): string {
    return new Date().toISOString();
  }

  private static formatLogMessage(
    level: 'INFO' | 'WARN' | 'ERROR',
    context: AuthLogContext,
    details: AuthEventDetails,
    message: string
  ): string {
    const timestamp = AuthLogger.createTimestamp();
    const logData = {
      timestamp,
      level,
      operation: context.operation,
      requestId: context.requestId,
      message,
      ...details,
      request: {
        userAgent: context.userAgent,
        ip: context.ip,
        url: context.url
      }
    };
    
    return `[AUTH-${level}] ${message} | ${JSON.stringify(logData)}`;
  }

  /**
   * Log successful authentication events
   */
  static logSuccess(context: AuthLogContext, details: AuthEventDetails, message: string): void {
    const logMessage = AuthLogger.formatLogMessage('INFO', context, details, message);
    console.log(logMessage);
  }

  /**
   * Log authentication failures and errors
   */
  static logError(context: AuthLogContext, details: AuthEventDetails, message: string): void {
    const logMessage = AuthLogger.formatLogMessage('ERROR', context, details, message);
    console.error(logMessage);
  }

  /**
   * Log authentication warnings (e.g., deprecated flows, missing configs)
   */
  static logWarning(context: AuthLogContext, details: AuthEventDetails, message: string): void {
    const logMessage = AuthLogger.formatLogMessage('WARN', context, details, message);
    console.warn(logMessage);
  }

  /**
   * Log incoming authentication requests
   */
  static logRequest(context: AuthLogContext, details: AuthEventDetails): void {
    AuthLogger.logSuccess(context, details, `Authentication request received`);
  }

  /**
   * Log authentication responses
   */
  static logResponse(context: AuthLogContext, details: AuthEventDetails, success: boolean): void {
    if (success) {
      AuthLogger.logSuccess(context, details, `Authentication response sent`);
    } else {
      AuthLogger.logError(context, details, `Authentication failed response sent`);
    }
  }

  /**
   * Log Firebase-specific events
   */
  static logFirebaseEvent(
    context: AuthLogContext, 
    details: AuthEventDetails & { firebaseAction?: string },
    success: boolean,
    message: string
  ): void {
    const eventDetails = {
      ...details,
      provider: 'firebase',
      action: details.firebaseAction || 'unknown'
    };
    
    if (success) {
      AuthLogger.logSuccess(context, eventDetails, `Firebase: ${message}`);
    } else {
      AuthLogger.logError(context, eventDetails, `Firebase: ${message}`);
    }
  }

  /**
   * Create request context from Next.js request
   */
  static createRequestContext(request: Request, operation: string): AuthLogContext {
    const url = new URL(request.url);
    const requestId = request.headers.get('x-request-id') || 
                     `req-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    
    return {
      operation,
      requestId,
      userAgent: request.headers.get('user-agent') || 'unknown',
      ip: request.headers.get('x-forwarded-for') || 
          request.headers.get('x-real-ip') || 
          'unknown',
      url: `${url.pathname}${url.search}`
    };
  }

  /**
   * Extract auth details from URL search params
   */
  static extractAuthDetailsFromParams(searchParams: URLSearchParams): AuthEventDetails {
    return {
      apiKey: searchParams.get('apiKey') || undefined,
      oobCode: searchParams.get('oobCode') || undefined,
      mode: searchParams.get('mode') || undefined,
      lang: searchParams.get('lang') || undefined,
      email: searchParams.get('email') || undefined,
      timestamp: AuthLogger.createTimestamp()
    };
  }
}