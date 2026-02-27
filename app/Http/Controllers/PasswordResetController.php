<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class PasswordResetController extends Controller
{
    /**
     * Tampilkan halaman lupa password (hubungi admin)
     */
    public function showForgotForm()
    {
        return Inertia::render('Auth/ForgotPassword');
    }
}
