<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TransaksiController;
use App\Http\Controllers\NotificationController;
use App\Http\Middleware\EnsureAdmin;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/produk/{id}', [HomeController::class, 'show'])->name('produk.show');

// Auth
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:5,1');
Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:5,1');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// User Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [UserController::class, 'index'])->name('user.dashboard');
    Route::get('/log-aktivitas', [UserController::class, 'activityLog'])->name('user.activity_log');
    Route::get('/pesanan', [UserController::class, 'pesanan'])->name('user.pesanan');
    Route::get('/checkout/{id}', [TransaksiController::class, 'checkout'])->name('transaksi.checkout');
    Route::post('/buy', [TransaksiController::class, 'store'])->name('transaksi.store');
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
        Route::get('/produk', [AdminController::class, 'produkIndex'])->name('admin.produk.index');
        Route::post('/produk', [AdminController::class, 'storeProduk'])->name('admin.produk.store');
        Route::get('/produk/{id}/edit', [AdminController::class, 'editProduk'])->name('admin.produk.edit');
        Route::put('/produk/{id}', [AdminController::class, 'updateProduk'])->name('admin.produk.update');
        Route::delete('/produk/{id}', [AdminController::class, 'destroyProduk'])->name('admin.produk.destroy');
        
        // User Management
        Route::get('/users', [AdminController::class, 'usersIndex'])->name('admin.users.index');
        Route::post('/add-admin', [AdminController::class, 'storeAdmin'])->name('admin.store');
        Route::delete('/user/{id}', [AdminController::class, 'destroyUser'])->name('admin.user.destroy');
        
        // Payment Verification
        Route::get('/pembayaran', [AdminController::class, 'pembayaranIndex'])->name('admin.pembayaran');
        Route::post('/transaction/{id}/{status}', [AdminController::class, 'confirmPayment'])->name('admin.transaction.confirm');
        
        // Activity Log
        Route::get('/log', [AdminController::class, 'logIndex'])->name('admin.log');
        
        // Financial Report
        Route::get('/laporan', [AdminController::class, 'laporanKeuangan'])->name('admin.laporan');
    });
});
