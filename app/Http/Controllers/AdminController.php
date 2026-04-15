<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{

    /**
     * Display the management dashboard.
     */
    public function dashboard(Request $request)
    {
        $user = auth()->user();

        // Robust check for manager/leader access
        if (!$user || !$user->roles->whereIn('role', ['manager'])->isNotEmpty()) {
            abort(403);
        }

        // Fetch all players and leaders
        $players = User::whereHas('roles', function ($query) {
            $query->whereIn('role', ['player', 'leader']);
        })->with('roles')->get();

        return Inertia::render('dashboard', [
            'players' => $players
        ]);
    }

    /**
     * Add a new player.
     */
    public function add_player(Request $request)
    {
        $validate = $request->validate([
            'name' => "string|required|max:255",
            "email" => "email|required|max:255|unique:users,email",
            "password" => "string|required|min:8|max:255"
        ]);

        if (!auth()->user()->roles->whereIn('role', ['leader', 'manager'])->isNotEmpty()) {
            abort(403);
        }

        // Count users with player or leader roles
        $number_of_players = User::whereHas('roles', function ($query) {
            $query->whereIn('role', ['player', 'leader']);
        })->count();

        if ($number_of_players >= 6) {
            return back()->with('error', 'Maximum number of players reached.');
        }

        $user = User::create($validate);
        $player_role = Role::where('role', 'player')->first();
        $user->roles()->attach($player_role->id);

        return redirect()->route('dashboard');
    }

    /**
     * Update player details.
     */
    public function update_player(Request $request, User $user)
    {
        $validate = $request->validate([
            'name' => "string|required|max:255",
            "email" => "email|required|max:255|unique:users,email," . $user->id,
        ]);

        if (!auth()->user()->roles->whereIn('role', ['manager'])->isNotEmpty()) {
            abort(403);
        }

        $user->update($validate);

        return redirect()->route('dashboard');
    }

    /**
     * Set a specific player as the team leader.
     */
    public function set_leader(Request $request, User $user)
    {
        if (!auth()->user()->roles->where('role', 'manager')->isNotEmpty()) {
            abort(403);
        }

        $leader_role = Role::where('role', 'leader')->first();

        // Remove leader role from everyone else
        $prev_user = User::whereHas('roles', function ($query) {
            $query->where('role', 'leader');
        })->with('roles')->first();

        if ($prev_user) {
            $prev_user->roles()->detach($leader_role->id);
        }

        // Assign leader role to target user
        $user->roles()->attach($leader_role->id);

        return redirect()->route('dashboard');
    }

    /**
     * Delete a player.
     */
    public function delete_user(Request $request, User $user)
    {
        if (!auth()->user()->roles->where('role', 'manager')->isNotEmpty()) {
            abort(403);
        }

        $user->deleteOrFail();

        return redirect()->route('dashboard');
    }
}
