<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function home(Request $request)
    {
        $games = Game::all();
        return inertia('welcome', ["games" => $games]);
    }

    public function get_games(Request $request)
    {
        $games = Game::all();
        return response()->json(["data" => $games]);
    }

    public function add_games(Request $request)
    {
        $values = $request->validate([
            'title' => "string|required|trim",
            "description" => "string|required|trim",
            "date" => "string|required|trim",
            "time" => "string|required|trim",
            "mapCount" => "integer|required",
            "maps" => "nullable|string|trim"
        ]);

        Game::create($values);

        return redirect()->route('home')->with(["success" => $values]);

    }

    public function delete_game(Request $request, Game $game)
    {
        $game->delete();
        return redirect('/');
    }

    public function edit_game(Request $request, Game $game)
    {
        $values = $request->validate([
            'title' => "string|required",
            "description" => "string|required",
            "date" => "string|required",
            "time" => "string|required",
            "mapCount" => "integer|required",
            "maps" => "nullable|string"
        ]);

        $game->update($values);

        return redirect()->route("home")->with(["success" => "Lol"]);
    }
}
