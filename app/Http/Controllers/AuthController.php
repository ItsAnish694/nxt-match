<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validate = $request->validate([
            "email" => "required|email|max:255",
            "password" => "string|required"
        ]);

        if (!\Auth::attempt($validate, true)) {
            return response()->json([
                "Error" => "Wrong Credentials"
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
