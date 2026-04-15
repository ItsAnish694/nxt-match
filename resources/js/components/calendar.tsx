import { useState } from 'react';
import type { Game } from '@/types/game';

type Props = {
    handleDateChange: React.Dispatch<React.SetStateAction<string>>;
    games: Game[];
};

function Calendar({ handleDateChange, games }: Props) {
    // Generate an array of 35 days for a mockup month view.
    const now = new Date();
    const gameMap = new Map();
    const date = now.toDateString();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();
    const [year, setYear] = useState(currentYear);
    const [month, setMonth] = useState(currentMonth);
    const [isSelected, setIsSelected] = useState(date);

    games.forEach((game) => {
        const date = game.date;

        if (!gameMap.has(date)) {
            gameMap.set(date, []); // initialize array for new date
        }

        gameMap.get(date).push(game); // add person to that date
    });

    function getDateDetails(year: number, month: number) {
        const numberOfDays = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const monthName = new Date(year, month).toLocaleString('en-US', {
            month: 'long',
        });

        return { firstDayOfMonth, numberOfDays, monthName };
    }

    function updateDate(val: number) {
        setMonth((prevMonth) => {
            if (prevMonth === 0 && val === -1) {
                setYear((prevYear) => prevYear - 1);

                return 11;
            }

            if (prevMonth === 11 && val === 1) {
                setYear((prevYear) => prevYear + 1);

                return 0;
            }

            if (val === 0) {
                setYear(currentYear);

                return currentMonth;
            }

            return prevMonth + val;
        });
    }

    const { firstDayOfMonth, numberOfDays, monthName } = getDateDetails(
        year,
        month,
    );

    const isCurrentTime = currentMonth === month && currentYear === year;

    const days = [];
    const startingWeek = 1 - firstDayOfMonth;

    for (let i = startingWeek; i <= 42 - firstDayOfMonth; i++) {
        let dayNum = 0;
        let gamesCount = [];

        if (i >= 1 && i <= numberOfDays) {
            dayNum = i;
            gamesCount =
                gameMap.get(new Date(year, month, dayNum).toDateString()) || [];
        }

        days.push({
            day: dayNum || '',
            gamesCount: gamesCount.length,
        });
    }

    return (
        <div className="group relative col-span-1 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/50 p-4 shadow-2xl backdrop-blur-md sm:p-6 lg:col-span-8">
            <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-transparent via-cyan-500 to-transparent opacity-50 transition-opacity group-hover:opacity-100"></div>

            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <h2 className="flex items-center gap-2 text-lg font-bold tracking-widest text-white uppercase">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400"></span>
                    Match Calendar
                </h2>
                <div className="flex w-full items-center gap-2 sm:w-auto">
                    <button
                        onClick={() => {
                            updateDate(0);
                            setIsSelected(date);
                            handleDateChange(date);
                        }}
                        className="group/today relative flex h-full items-center justify-center rounded-lg border border-white/5 bg-neutral-950/50 px-4 py-2.5 text-[10px] font-black tracking-widest text-cyan-400 transition-all hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:text-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] active:scale-95 sm:px-6 sm:py-3"
                    >
                        <span className="relative z-10">TODAY</span>
                        <div className="absolute inset-0 rounded-lg bg-cyan-400/0 opacity-0 transition-all duration-300 group-hover/today:bg-cyan-400/5 group-hover/today:opacity-100"></div>
                    </button>
                    <div className="flex flex-1 items-center justify-between gap-2 rounded-lg border border-white/5 bg-neutral-950/50 p-1 sm:w-auto sm:flex-none sm:justify-start">
                        <button
                            onClick={() => updateDate(-1)}
                            className="rounded p-2 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                        </button>
                        <span className="min-w-30 text-center text-sm font-bold uppercase transition-all">
                            {monthName} {year}
                        </span>
                        <button
                            onClick={() => updateDate(1)}
                            className="rounded p-2 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Monthly Days Header */}
            <div className="mb-2 grid grid-cols-7 gap-1 sm:gap-2">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(
                    (day) => (
                        <div
                            key={day}
                            className="py-2 text-center text-[10px] font-bold tracking-wider text-neutral-500 sm:text-xs"
                        >
                            {day}
                        </div>
                    ),
                )}
            </div>

            {/* Full Month Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {days.map((d, i) => (
                    <div
                        key={i}
                        // onDoubleClick={() =>}
                        onClick={() => {
                            if (d.day) {
                                const selectedDate = new Date(
                                    year,
                                    month,
                                    d.day as number,
                                ).toDateString();

                                handleDateChange(selectedDate);
                                setIsSelected(selectedDate);
                            }
                        }}
                        className={`relative flex aspect-square cursor-pointer items-center justify-center rounded-lg border transition-all sm:rounded-xl ${
                            d.day === currentDay && isCurrentTime
                                ? 'border-cyan-400/50 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                                : `${isSelected === new Date(year, month, d.day as number).toDateString() && d.day !== '' ? 'border-cyan-400/50' : 'border-white/10'} bg-neutral-950/50 text-neutral-300 hover:border-white/20 hover:bg-white/5 hover:text-white`
                        }`}
                    >
                        {/* Task Count on Upper Left */}
                        {d.gamesCount > 0 && (
                            <div
                                className={`absolute top-1 left-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold sm:top-2 sm:left-2 sm:h-6 sm:w-6 sm:text-xs ${
                                    d.day === currentDay
                                        ? 'bg-cyan-400 text-black'
                                        : 'bg-white/10 text-white'
                                }`}
                            >
                                {d.gamesCount}
                            </div>
                        )}

                        <span
                            className={`text-xl font-black sm:text-3xl ${isCurrentTime && d.day === currentDay ? 'text-cyan-400' : ''}`}
                        >
                            {d.day}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Calendar;
