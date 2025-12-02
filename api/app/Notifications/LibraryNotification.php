<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class LibraryNotification extends Notification
{
    use Queueable;

    private $message;

    public function __construct($message)
    {
        $this->message = $message;
    }

    public function via($notifiable)
    {
        return ['database']; // <--- PENTING: Simpan ke Database
    }

    public function toArray($notifiable)
    {
        return [
            'message' => $this->message, // Pesan yang akan disimpan
            'time' => now()
        ];
    }
}