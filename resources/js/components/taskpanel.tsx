import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { Game } from '@/types/game';
import DeleteModal from './deletemodal';
import EditModal from './editmodal';
import Modal from './modal';
import ViewModal from './viewmodal';

type Props = {
    games: Game[];
    date: string;
};

function Taskpanel({ games, date }: Props) {
    const { auth } = usePage().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState<Game>(games[0]);

    // console.log(auth.user?.roles?);

    const sortedGames = [...games].sort((a, b) => {
        const [hoursA, minutesA] = a.time.split(':').map(Number);
        const [hoursB, minutesB] = b.time.split(':').map(Number);

        return hoursA * 60 + minutesA - (hoursB * 60 + minutesB);
    });

    const gamesWithCollisions = sortedGames.map((game, index) => {
        const [hours, minutes] = game.time.split(':').map(Number);
        const start = hours * 60 + minutes;
        const end = start + game.mapCount * 20;

        const hasCollision = sortedGames.some((otherGame, otherIndex) => {
            if (index === otherIndex) {
                return false;
            }

            const [oHours, oMinutes] = otherGame.time.split(':').map(Number);
            const oStart = oHours * 60 + oMinutes;
            const oEnd = oStart + otherGame.mapCount * 20;

            return start < oEnd && oStart < end;
        });

        return { ...game, hasCollision };
    });

    function convertTo12HourFormat(time: string) {
        const [hour, minute] = time.split(':').map(Number);
        const date = new Date();
        date.setHours(hour);
        date.setMinutes(minute);

        return date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });
    }

    return (
        <div className="group relative col-span-1 flex h-125 flex-col rounded-2xl border border-white/10 bg-neutral-900/50 p-4 shadow-2xl backdrop-blur-md sm:p-6 lg:col-span-4 lg:h-[calc(100vh-8rem)]">
            <div className="absolute top-0 left-0 h-1 w-full bg-linear-to-r from-transparent via-fuchsia-500 to-transparent opacity-50 transition-opacity group-hover:opacity-100"></div>

            <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
                <h2 className="flex items-center gap-2 text-lg font-bold tracking-widest text-white uppercase">
                    🗓 Match Schedule
                </h2>
                {games.length > 0 && (
                    <span className="rounded-md bg-fuchsia-400/10 px-2 py-1 text-[10px] font-bold text-fuchsia-400 sm:px-3 sm:text-xs">
                        {games.length}{' '}
                        {games.length === 1 ? 'MATCH' : 'MATCHES'}
                    </span>
                )}
            </div>

            <div className="custom-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto pr-2">
                {gamesWithCollisions.length > 0 ? (
                    gamesWithCollisions.map((game) => (
                        <div
                            key={game.id}
                            onClick={() => {
                                setSelectedGame(game);
                                setIsViewModalOpen(true);
                            }}
                            className={`group/task relative flex cursor-pointer flex-col gap-3 rounded-xl border p-4 transition-all hover:bg-white/5 ${
                                game.hasCollision
                                    ? 'border-rose-500/30 bg-rose-500/5 hover:border-rose-500/50 hover:shadow-[0_0_20px_rgba(244,63,94,0.1)]'
                                    : 'border-white/5 bg-white/2 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.05)]'
                            }`}
                        >
                            <div className="flex items-start justify-between gap-4 overflow-hidden">
                                <div className="flex grow flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`font-mono text-xs font-bold ${game.hasCollision ? 'text-rose-400' : 'text-cyan-400'}`}
                                        >
                                            {convertTo12HourFormat(game.time)}
                                        </span>
                                        <span className="h-1 w-1 rounded-full bg-neutral-600"></span>
                                        <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-bold text-neutral-400 uppercase">
                                            BO{game.mapCount}
                                        </span>
                                        {game.hasCollision && (
                                            <span className="animate-pulse rounded bg-rose-500/20 px-1.5 py-0.5 text-[9px] font-bold text-rose-400">
                                                COLLISION
                                            </span>
                                        )}
                                    </div>
                                    <h3
                                        className={`block text-sm font-bold transition-colors ${
                                            game.hasCollision
                                                ? 'text-rose-400'
                                                : 'text-white group-hover/task:text-cyan-400'
                                        }`}
                                    >
                                        {game.title}
                                    </h3>
                                    <p className="line-clamp-1 w-full text-xs text-wrap text-neutral-400">
                                        {game.description}
                                    </p>
                                </div>
                            </div>

                            {game.maps?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {game.maps.split(',').map((map, mi) => (
                                        <span
                                            key={mi}
                                            className="rounded-full border border-white/5 bg-neutral-800/80 px-2 py-0.5 text-[9px] font-medium tracking-tight text-neutral-300 capitalize"
                                        >
                                            {map}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {(auth.user?.roles?.includes('manager') ||
                                auth.user?.roles?.includes('leader')) && (
                                <div className="absolute top-2 right-2 flex gap-1 opacity-100 transition-opacity">
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            // Handle edit action here
                                            e.stopPropagation();
                                            setIsEditModalOpen(true);
                                            setSelectedGame(game);
                                        }}
                                        className={`rounded-lg bg-neutral-800/80 p-1.5 text-neutral-400 transition-colors hover:bg-neutral-700 ${game.hasCollision ? 'hover:text-rose-400' : 'hover:text-cyan-400'}`}
                                        title="Edit Match"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3.5 w-3.5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsDeleteModalOpen(true);
                                            setSelectedGame(game);
                                        }}
                                        className="rounded-lg bg-neutral-800/80 p-1.5 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-rose-400"
                                        title="Delete Match"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-3.5 w-3.5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-neutral-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-neutral-500">
                            No matches scheduled
                        </p>
                        <p className="mt-1 text-[10px] text-neutral-600">
                            Select another date or add a new match
                        </p>
                    </div>
                )}
            </div>

            {/* TODO: Add Proper Role Validation */}
            {(auth.user?.roles?.includes('manager') ||
                auth.user?.roles?.includes('leader')) && (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 py-3 text-sm font-bold text-neutral-400 transition-all hover:-translate-y-1 hover:border-cyan-400 hover:bg-cyan-400/10 hover:text-white hover:shadow-[0_0_15px_rgba(34,211,238,0.2)] sm:py-4"
                >
                    <span className="text-lg leading-none">+</span>
                    <span>ADD MATCH</span>
                </button>
            )}

            {isModalOpen &&
                typeof document !== 'undefined' &&
                createPortal(
                    <Modal setIsModalOpen={setIsModalOpen} date={date} />,
                    document.body,
                )}

            {isDeleteModalOpen &&
                typeof document !== 'undefined' &&
                createPortal(
                    <DeleteModal
                        setIsModalOpen={setIsDeleteModalOpen}
                        deleteId={selectedGame.id}
                    />,
                    document.body,
                )}

            {isViewModalOpen &&
                typeof document !== 'undefined' &&
                createPortal(
                    <ViewModal
                        setIsModalOpen={setIsViewModalOpen}
                        gameToView={selectedGame}
                    />,
                    document.body,
                )}

            {isEditModalOpen &&
                typeof document !== 'undefined' &&
                createPortal(
                    <EditModal
                        setIsModalOpen={setIsEditModalOpen}
                        gameToEdit={selectedGame}
                    />,
                    document.body,
                )}
        </div>
    );
}

export default Taskpanel;
