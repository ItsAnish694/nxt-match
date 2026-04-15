import React from 'react';
import type { Game } from '@/types/game';

type Props = {
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    gameToDelete: Game;
};

function DeleteModal({ setIsModalOpen, gameToDelete }: Props) {
    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-bold tracking-widest text-white uppercase">
                        Are You Sure?
                    </h3>
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="text-neutral-400 transition-colors hover:text-white"
                    >
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
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <form
                    action={`/api/delete/${gameToDelete?.id}`}
                    method="POST"
                    className="flex flex-col gap-4"
                >
                    <div className="mt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-bold text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            className="flex-1 rounded-xl bg-red-500 py-3 text-sm font-bold text-black shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all hover:bg-red-600"
                        >
                            DELETE
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DeleteModal;
