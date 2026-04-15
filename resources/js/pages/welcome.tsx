import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Calendar, Navbar, Taskpanel } from '@/components';
import type { Game } from '@/types/game';

export default function Welcome() {
    const { games, auth } = usePage().props;

    const today = new Date().toDateString();
    const [date, setDate] = useState(today);

    if (!Array.isArray(games)) {
        return;
    }

    const allGames = auth.user ? games : [];

    const gamesThatDay = allGames.filter((games: Game) => games.date === date);

    return (
        <div className="flex min-h-screen flex-col items-center bg-neutral-950 font-sans text-neutral-100 selection:bg-cyan-500 selection:text-white">
            {/* Background Effects */}
            <div className="pointer-events-none fixed inset-0 z-0 flex justify-center overflow-hidden">
                <div className="absolute top-[-20%] h-200 w-200 rounded-full bg-cyan-600/20 mix-blend-screen blur-[120px]" />
                <div className="absolute top-[40%] right-[-10%] h-150 w-150 rounded-full bg-fuchsia-600/20 mix-blend-screen blur-[120px]" />
            </div>

            <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-16 sm:px-6">
                {/* Navbar */}
                <Navbar />

                {/* Main Content Area */}
                <main className="grid flex-1 grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Full Calendar Column */}
                    <Calendar games={allGames} handleDateChange={setDate} />
                    {/* Task Panel Column */}
                    <Taskpanel games={gamesThatDay} date={date} />
                </main>
            </div>

            {/* Inline styles for custom scrollbar to match the theme */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.3);
                }
            `,
                }}
            />
        </div>
    );
}
