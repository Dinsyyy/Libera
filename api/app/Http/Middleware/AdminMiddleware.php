<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth; // <-- Import Auth

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Cek: Apakah pengguna sudah login DAN apakah role-nya 'admin'?
        if (Auth::check() && Auth::user()->role === 'admin') {
            // Jika ya, izinkan request lanjut
            return $next($request);
        }

        // Jika tidak, tolak dengan error 403 (Forbidden)
        return response()->json(['message' => 'Akses ditolak. Hanya untuk Admin.'], 403);
    }
}