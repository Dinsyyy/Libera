<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetCspHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $csp = [
            "default-src *", // Allow everything by default for development
            "script-src * 'unsafe-inline' 'unsafe-eval' blob:",
            "style-src * 'unsafe-inline'",
            "font-src * data:",
            "img-src * data:",
            "connect-src *", // Allow connections to any origin for development
        ];

        $response->headers->set('Content-Security-Policy', implode('; ', $csp));

        return $response;
    }
}
