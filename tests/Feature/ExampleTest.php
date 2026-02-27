<?php

use App\Models\User;
use App\Models\Produk;
use App\Models\Transaksi;

/*
|--------------------------------------------------------------------------
| Auth Tests
|--------------------------------------------------------------------------
*/

test('halaman login bisa diakses', function () {
    $this->get('/login')->assertStatus(200);
});

test('halaman register bisa diakses', function () {
    $this->get('/register')->assertStatus(200);
});

test('user bisa login dengan kredensial yang benar', function () {
    $user = User::factory()->create([
        'password' => 'password123',
        'role' => 'user',
    ]);

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'password123',
    ])->assertRedirect('/');

    $this->assertAuthenticatedAs($user);
});

test('user tidak bisa login dengan password salah', function () {
    $user = User::factory()->create([
        'password' => 'password123',
    ]);

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrongpassword',
    ]);

    $this->assertGuest();
});

test('user bisa register', function () {
    $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ])->assertRedirect('/');

    $this->assertAuthenticated();
    $this->assertDatabaseHas('users', [
        'email' => 'test@example.com',
        'role' => 'user',
    ]);
});

test('user bisa logout', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/logout')
        ->assertRedirect('/');

    $this->assertGuest();
});

/*
|--------------------------------------------------------------------------
| Role Guard Tests
|--------------------------------------------------------------------------
*/

test('guest tidak bisa akses dashboard', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

test('user biasa tidak bisa akses admin panel', function () {
    $user = User::factory()->create(['role' => 'user']);

    $this->actingAs($user)
        ->get('/admin')
        ->assertStatus(403);
});

test('admin bisa akses admin panel', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->get('/admin')
        ->assertStatus(200);
});

test('admin bisa akses halaman kelola produk', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->get('/admin/produk')
        ->assertStatus(200);
});

test('admin bisa akses halaman kelola users', function () {
    $admin = User::factory()->create(['role' => 'admin']);

    $this->actingAs($admin)
        ->get('/admin/users')
        ->assertStatus(200);
});

/*
|--------------------------------------------------------------------------
| Checkout & Transaksi Tests
|--------------------------------------------------------------------------
*/

test('user bisa akses halaman checkout produk aktif', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::create([
        'nama' => 'Diamond ML',
        'deskripsi' => 'Top up diamond mobile legends',
        'harga' => 10000,
        'stok' => 100,
        'kategori_input' => 'id_server',
        'is_active' => true,
        'user_id' => $admin->id,
    ]);

    $user = User::factory()->create(['role' => 'user']);

    $this->actingAs($user)
        ->get("/checkout/{$produk->id}")
        ->assertStatus(200);
});

test('user tidak bisa checkout produk yang sedang maintenance', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::create([
        'nama' => 'Diamond ML',
        'deskripsi' => 'Maintenance product',
        'harga' => 10000,
        'stok' => 100,
        'kategori_input' => 'id_server',
        'is_active' => false,
        'user_id' => $admin->id,
    ]);

    $user = User::factory()->create(['role' => 'user']);

    $this->actingAs($user)
        ->get("/checkout/{$produk->id}")
        ->assertRedirect('/');
});

test('stok berkurang setelah checkout', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::create([
        'nama' => 'Diamond ML',
        'deskripsi' => 'Top up',
        'harga' => 10000,
        'stok' => 50,
        'kategori_input' => 'id_server',
        'is_active' => true,
        'user_id' => $admin->id,
    ]);

    $user = User::factory()->create(['role' => 'user']);

    $bukti = \Illuminate\Http\UploadedFile::fake()->image('bukti.jpg');

    $this->actingAs($user)->post('/buy', [
        'produk_id' => $produk->id,
        'kuantitas' => 3,
        'payment_method' => 'dana',
        'game_id' => '123456',
        'server_id' => '7890',
        'bukti_pembayaran' => $bukti,
    ]);

    $produk->refresh();
    expect($produk->stok)->toBe(47);

    $this->assertDatabaseHas('transaksis', [
        'user_id' => $user->id,
        'produk_id' => $produk->id,
        'kuantitas' => 3,
        'total_harga' => 30000,
        'status' => 'pending',
    ]);
});

test('checkout gagal jika stok tidak cukup', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::create([
        'nama' => 'Diamond ML',
        'deskripsi' => 'Top up',
        'harga' => 10000,
        'stok' => 2,
        'kategori_input' => 'catatan',
        'is_active' => true,
        'user_id' => $admin->id,
    ]);

    $user = User::factory()->create(['role' => 'user']);
    $bukti = \Illuminate\Http\UploadedFile::fake()->image('bukti.jpg');

    $response = $this->actingAs($user)->post('/buy', [
        'produk_id' => $produk->id,
        'kuantitas' => 5,
        'payment_method' => 'qris',
        'catatan' => 'Test catatan',
        'bukti_pembayaran' => $bukti,
    ]);

    // Stok tetap karena validasi max gagal
    $produk->refresh();
    expect($produk->stok)->toBe(2);
});

/*
|--------------------------------------------------------------------------
| Payment Verification Tests
|--------------------------------------------------------------------------
*/

test('admin bisa konfirmasi pembayaran', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create(['role' => 'user']);
    $produk = Produk::create([
        'nama' => 'Test', 'deskripsi' => 'Test', 'harga' => 5000,
        'stok' => 10, 'kategori_input' => 'catatan', 'is_active' => true, 'user_id' => $admin->id,
    ]);

    $transaksi = Transaksi::create([
        'user_id' => $user->id,
        'produk_id' => $produk->id,
        'kuantitas' => 1,
        'total_harga' => 5000,
        'payment_method' => 'dana',
        'status' => 'pending',
    ]);

    $this->actingAs($admin)
        ->post("/admin/transaction/{$transaksi->id}/paid")
        ->assertRedirect();

    $transaksi->refresh();
    expect($transaksi->status)->toBe('paid');
});

test('admin bisa menolak pembayaran dan stok dikembalikan', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create(['role' => 'user']);
    $produk = Produk::create([
        'nama' => 'Test', 'deskripsi' => 'Test', 'harga' => 5000,
        'stok' => 7, 'kategori_input' => 'catatan', 'is_active' => true, 'user_id' => $admin->id,
    ]);

    $transaksi = Transaksi::create([
        'user_id' => $user->id,
        'produk_id' => $produk->id,
        'kuantitas' => 3,
        'total_harga' => 15000,
        'payment_method' => 'qris',
        'status' => 'pending',
    ]);

    $this->actingAs($admin)
        ->post("/admin/transaction/{$transaksi->id}/reject", [
            'alasan_penolakan' => 'Bukti transfer blur',
        ])
        ->assertRedirect();

    $transaksi->refresh();
    $produk->refresh();
    expect($transaksi->status)->toBe('failed');
    expect($transaksi->alasan_penolakan)->toBe('Bukti transfer blur');
    expect($produk->stok)->toBe(10); // 7 + 3 dikembalikan
});

/*
|--------------------------------------------------------------------------
| Notification Tests
|--------------------------------------------------------------------------
*/

test('notifikasi terkirim saat pembayaran dikonfirmasi', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $user = User::factory()->create(['role' => 'user']);
    $produk = Produk::create([
        'nama' => 'Test', 'deskripsi' => 'Test', 'harga' => 5000,
        'stok' => 10, 'kategori_input' => 'catatan', 'is_active' => true, 'user_id' => $admin->id,
    ]);

    $transaksi = Transaksi::create([
        'user_id' => $user->id,
        'produk_id' => $produk->id,
        'kuantitas' => 1,
        'total_harga' => 5000,
        'payment_method' => 'dana',
        'status' => 'pending',
    ]);

    $this->actingAs($admin)
        ->post("/admin/transaction/{$transaksi->id}/paid");

    $this->assertDatabaseHas('notifications', [
        'user_id' => $user->id,
        'type' => 'payment_confirmed',
    ]);
});

/*
|--------------------------------------------------------------------------
| Homepage Tests
|--------------------------------------------------------------------------
*/

test('halaman beranda bisa diakses', function () {
    $this->get('/')->assertStatus(200);
});

test('produk tidak aktif di-redirect dari halaman detail', function () {
    $admin = User::factory()->create(['role' => 'admin']);
    $produk = Produk::create([
        'nama' => 'Maintenance Product',
        'deskripsi' => 'Sedang maintenance',
        'harga' => 10000,
        'stok' => 100,
        'kategori_input' => 'id_server',
        'is_active' => false,
        'user_id' => $admin->id,
    ]);

    $this->get("/produk/{$produk->id}")->assertRedirect('/');
});
