<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            "email" => "required|email|max:255",
            "password" => "string|required"
        ]);

        $validate = [
            'email' => trim($request->input("email")),
            'password' => trim($request->input('password'))
        ];

        if (!\Auth::attempt($validate, true)) {
            throw ValidationException::withMessages([
                'email' => ['Wrong credentials.'],
            ]);
        }

        $request->session()->regenerate();
        $request->session()->regenerateToken();

        return redirect('/');
    }

    public function logout(Request $request)
    {
        \Auth::logout();

        $request->session()->regenerate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
