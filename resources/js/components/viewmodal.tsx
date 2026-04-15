import React, { useEffect } from 'react';
import type { Game } from '@/types/game';

type Props = {
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    gameToView: Game;
};

function ViewModal({ setIsModalOpen, gameToView }: Props) {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsModalOpen(false);
            }
        };
        window.addEventListener('keydown', handleEsc);

        return () => window.removeEventListener('keydown', handleEsc);
    }, [setIsModalOpen]);

    if (!gameToView) {
        return null;
    }

    function convertTo12HourFormat(time: string) {
        if (!time) {
            return '';
        }

        const [hour, minute] = time.split(':').map(Number);
        const date = new Date();
        date.setHours(hour || 0);
        date.setMinutes(minute || 0);

        return date.toLocaleString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });
    }

    return (
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity sm:p-6"
            onClick={() => setIsModalOpen(false)}
        >
            <div
                className="animate-in zoom-in-95 relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 shadow-2xl duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Decorative Glow Effects */}
                <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl"></div>

                {/* Header */}
                <div className="relative flex items-center justify-between border-b border-white/10 bg-white/5 px-6 py-4">
                    <h2 className="flex items-center gap-2 text-xl font-bold tracking-widest text-white uppercase">
                        <span className="text-cyan-400">📋</span> Match Details
                    </h2>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="rounded-lg bg-white/5 p-2 text-neutral-400 transition-colors hover:bg-rose-500/20 hover:text-rose-400"
                        title="Close"
                    >
                        <svg
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="relative p-6 pt-5">
                    <h3 className="mb-4 text-2xl font-black tracking-tight text-white">
                        {gameToView.title}
                    </h3>

                    <div className="mb-6 flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-black/40 px-3 py-2 shadow-inner">
                            <svg
                                className="h-4 w-4 text-cyan-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span className="font-mono text-sm font-medium text-neutral-200">
                                {convertTo12HourFormat(gameToView.time)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-black/40 px-3 py-2 shadow-inner">
                            <svg
                                className="h-4 w-4 text-fuchsia-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            <span className="text-sm font-medium text-neutral-200">
                                {new Date(gameToView.date).toLocaleDateString(
                                    'en-US',
                                    {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    },
                                )}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-black/40 px-3 py-2 shadow-inner">
                            <span className="font-mono text-xs font-bold text-neutral-400 uppercase">
                                Format
                            </span>
                            <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm font-bold text-white">
                                BO{gameToView.mapCount}
                            </span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h4 className="mb-2 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                            Description
                        </h4>
                        <div className="rounded-xl border border-white/5 bg-white/5 p-4 shadow-inner">
                            <p className="text-sm leading-relaxed text-neutral-300">
                                {gameToView.description || (
                                    <span className="text-neutral-600 italic">
                                        No match description provided.
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    {gameToView.maps && gameToView.maps.trim().length > 0 && (
                        <div>
                            <h4 className="mb-2 text-xs font-bold tracking-wider text-neutral-500 uppercase">
                                Maps &amp; Bans
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {gameToView.maps.split(',').map((map, mi) => {
                                    const mapName = map.trim();

                                    if (!mapName) {
                                        return null;
                                    }

                                    return (
                                        <div
                                            key={mi}
                                            className="rounded-lg border border-white/10 bg-neutral-800/80 px-3 py-1.5 text-xs font-medium tracking-wide text-neutral-200 capitalize transition-colors hover:border-cyan-500/50 hover:bg-neutral-700"
                                        >
                                            {mapName}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="relative flex justify-end gap-3 border-t border-white/10 bg-black/20 px-6 py-4">
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-white/10 hover:shadow-lg active:scale-95"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ViewModal;
