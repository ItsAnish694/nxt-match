<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $role_id = Role::where(["role" => "manager"])->pluck('id');

        User::create([
            'name' => 'Anish Dhakal',
            'email' => 'anish@gmail.com',
            'password' => "password"
        ])->roles()->attach($role_id);
    }
}
