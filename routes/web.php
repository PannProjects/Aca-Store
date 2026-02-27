<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminProdukController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\AdminPembayaranController;
use App\Http\Controllers\AdminLaporanController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Middleware\EnsureAdmin;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/produk/{id}', [HomeController::class, 'show'])->name('produk.show');

// Auth
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,1');

    // Forgot Password (Hubungi Admin)
    Route::get('/forgot-password', [PasswordResetController::class, 'showForgotForm'])->name('password.request');
});
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// User Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [UserController::class, 'index'])->name('user.dashboard');
    Route::get('/log-aktivitas', [UserController::class, 'activityLog'])->name('user.activity_log');
    Route::get('/pesanan', [UserController::class, 'pesanan'])->name('user.pesanan');
    Route::get('/checkout/{id}', [TransaksiController::class, 'checkout'])->name('transaksi.checkout');
    Route::post('/buy', [TransaksiController::class, 'store'])->middleware('throttle:3,1')->name('transaksi.store');
    Route::post('/rate', [UserController::class, 'rate'])->name('rating.store');
    Route::get('/invoice/{id}', [TransaksiController::class, 'printPdf'])->name('invoice.print');
    
    // Profile Routes
    Route::get('/profile', [UserController::class, 'editProfile'])->name('profile.edit');
    Route::put('/profile', [UserController::class, 'updateProfile'])->name('profile.update');
    
    // Notification Routes
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
});

// Admin Routes
Route::middleware(['auth'])->group(function () {
    Route::prefix('admin')->middleware(EnsureAdmin::class)->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('admin.dashboard');
        
        // Produk Management
        Route::get('/produk', [AdminProdukController::class, 'index'])->name('admin.produk.index');
        Route::post('/produk', [AdminProdukController::class, 'store'])->name('admin.produk.store');
        Route::get('/produk/{id}/edit', [AdminProdukController::class, 'edit'])->name('admin.produk.edit');
        Route::put('/produk/{id}', [AdminProdukController::class, 'update'])->name('admin.produk.update');
        Route::delete('/produk/{id}', [AdminProdukController::class, 'destroy'])->name('admin.produk.destroy');
        
        // User Management
        Route::get('/users', [AdminUserController::class, 'index'])->name('admin.users.index');
        Route::post('/add-admin', [AdminUserController::class, 'storeAdmin'])->name('admin.store');
        Route::delete('/user/{id}', [AdminUserController::class, 'destroy'])->name('admin.user.destroy');
        Route::post('/user/{id}/reset-password', [AdminUserController::class, 'resetPassword'])->name('admin.user.reset-password');
        
        // Payment Verification
        Route::get('/pembayaran', [AdminPembayaranController::class, 'index'])->name('admin.pembayaran');
        Route::post('/transaction/{id}/reject', [AdminPembayaranController::class, 'reject'])->name('admin.transaction.reject');
        Route::post('/transaction/{id}/{status}', [AdminPembayaranController::class, 'confirm'])->name('admin.transaction.confirm');
        Route::delete('/transaction/{id}', [AdminPembayaranController::class, 'destroy'])->name('admin.transaction.destroy');
        
        // Activity Log
        Route::get('/log', [AdminController::class, 'logIndex'])->name('admin.log');
        
        // Financial Report
        Route::get('/laporan', [AdminLaporanController::class, 'index'])->name('admin.laporan');
    });
});
