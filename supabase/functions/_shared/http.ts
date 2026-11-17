export const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export function errorResponse(message: string, status: number, details?: unknown): Response {
  return jsonResponse({ error: message, details }, status);
}

/** Thrown by handlers to return a specific HTTP status with a user-safe message. */
export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
  }
}

/** Wraps a handler with CORS preflight handling and consistent error responses. */
export function serveJson(handler: (request: Request) => Promise<Response>): void {
  Deno.serve(async (request) => {
    if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
    if (request.method !== 'POST') return errorResponse('Method not allowed', 405);

    try {
      return await handler(request);
    } catch (error) {
      if (error instanceof HttpError)
        return errorResponse(error.message, error.status, error.details);
      console.error(error);
      return errorResponse('Internal error', 500);
    }
  });
}
