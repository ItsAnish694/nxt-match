<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GameController;
use Illuminate\Support\Facades\Route;


// Route::inertia('/', 'welcome')->name('home');
// manager account operations

Route::get('/', [GameController::class, 'home'])->name('home');
Route::get('/api/games', [GameController::class, 'get_games']);

// Auth Routes
Route::post('/api/login', [AuthController::class, "login"]);
Route::middleware(['auth'])->group(function () {
    Route::post('/api/logout', [AuthController::class, "logout"]);
    Route::get('/player/add', [AdminController::class, "dashboard"])->name('dashboard');
    Route::post('/api/player/add', [AdminController::class, "add_player"]);
    Route::post('/api/player/{user}/leader', [AdminController::class, "set_leader"]);
    Route::post('/api/player/{user}/edit', [AdminController::class, "update_player"]);
    Route::post('/api/player/{user}/delete', [AdminController::class, "delete_user"]);
    //Games Route
    Route::post('/api/games', [GameController::class, 'add_games']);
    Route::post('/api/delete/{game}', [GameController::class, 'delete_game']);
    Route::post('/api/edit/{game}', [GameController::class, 'edit_game']);
});


