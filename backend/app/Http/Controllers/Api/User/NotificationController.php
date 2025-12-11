<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'data' => $request->user()->notifications,
            'unread_count' => $request->user()->unreadNotifications->count(),
        ]);
    }

    public function markAsRead(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();

        return response()->json(['message' => 'Notifikasi ditandai sudah dibaca']);
    }
}
