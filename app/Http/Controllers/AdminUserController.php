<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function index()
    {
        $users = User::latest()->paginate(20);
        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    }

    public function storeAdmin(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ], [
            'password.min' => 'Password minimal 8 karakter.',
            'email.unique' => 'Email sudah terdaftar.',
        ]);

        $newAdmin = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'role' => 'admin',
        ]);

        \App\Models\ActivityLog::log('add_admin', 'Menambahkan admin baru: ' . $newAdmin->name, [
            'admin_id' => $newAdmin->id,
        ]);

        return back()->with('success', 'Admin baru berhasil ditambahkan.');
    }

    public function destroy($id)
    {
        if ((int) $id === Auth::id()) {
            return back()->with('error', 'Anda tidak bisa menghapus akun sendiri.');
        }

        $user = User::findOrFail($id);
        $userName = $user->name;
        $user->delete();
        
        \App\Models\ActivityLog::log('delete_user', 'Menghapus user: ' . $userName, [
            'user_id' => $id,
        ]);
        
        return back()->with('success', 'User berhasil dihapus.');
    }

    public function resetPassword($id)
    {
        $user = User::findOrFail($id);
        $newPassword = \Illuminate\Support\Str::random(8);
        $user->password = $newPassword;
        $user->save();

        \App\Models\ActivityLog::log('reset_password', 'Mereset password user: ' . $user->name, [
            'user_id' => $id,
        ]);

        return back()->with('success', "Password {$user->name} berhasil direset menjadi: {$newPassword}");
    }
}
