import { useForm } from '@inertiajs/react';
import React from 'react';
import { formatedDate } from '@/lib/utils';
import type { Game } from '@/types/game';

type Props = {
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    gameToEdit: Game;
};

function EditModal({ setIsModalOpen, gameToEdit }: Props) {
    const { data, setData, post, processing } = useForm({
        title: gameToEdit?.title,
        description: gameToEdit?.description,
        date: gameToEdit?.date,
        time: gameToEdit?.time,
        mapCount: gameToEdit?.mapCount,
        maps: gameToEdit?.maps,
    });

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(`/api/edit/${gameToEdit?.id}`);
        setIsModalOpen(false);
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-bold tracking-widest text-white uppercase">
                        Add New Match
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

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-neutral-400 uppercase">
                            Title
                        </label>
                        <input
                            type="text"
                            required
                            value={data.title}
                            onChange={(e) =>
                                setData('title', e.target.value)
                            }
                            placeholder="e.g. VCT Finals"
                            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white transition-colors outline-none focus:border-cyan-500/50 focus:bg-white/10"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-neutral-400 uppercase">
                            Description
                        </label>
                        <textarea
                            placeholder="Match details..."
                            required
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            rows={2}
                            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white transition-colors outline-none focus:border-cyan-500/50 focus:bg-white/10"
                        ></textarea>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex flex-1 flex-col gap-1.5">
                            <label className="text-xs font-bold text-neutral-400 uppercase">
                                Date
                            </label>
                            <input
                                type="date"
                                required
                                min={formatedDate()}
                                value={formatedDate(data.date)}
                                onChange={(e) =>
                                    setData(
                                        'date',
                                        new Date(
                                            e.target.value,
                                        ).toDateString(),
                                    )
                                }
                                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white scheme-dark transition-colors outline-none focus:border-cyan-500/50 focus:bg-white/10"
                            />
                        </div>
                        <div className="flex flex-1 flex-col gap-1.5">
                            <label className="text-xs font-bold text-neutral-400 uppercase">
                                Time
                            </label>
                            <input
                                type="time"
                                value={data.time}
                                required
                                onChange={(e) =>
                                    setData('time', e.target.value)
                                }
                                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white scheme-dark transition-colors outline-none focus:border-cyan-500/50 focus:bg-white/10"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex w-1/3 flex-col gap-1.5">
                            <label className="text-xs font-bold text-neutral-400 uppercase">
                                Number of Maps
                            </label>
                            <input
                                type="number"
                                min={1}
                                value={data.mapCount}
                                required
                                onChange={(e) =>
                                    setData(
                                        'mapCount',
                                        Number(e.target.value),
                                    )
                                }
                                placeholder="e.g. 3"
                                className="h-11.5 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white transition-colors outline-none focus:border-cyan-500/50 focus:bg-white/10"
                            />
                        </div>
                        <div className="flex flex-1 flex-col gap-1.5">
                            <label className="text-xs font-bold text-neutral-400 uppercase">
                                Maps (comma separated)
                            </label>
                            <input
                                type="text"
                                placeholder="Ascent, Bind..."
                                value={data.maps}
                                onChange={(e) =>
                                    setData('maps', e.target.value)
                                }
                                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white transition-colors outline-none focus:border-cyan-500/50 focus:bg-white/10"
                            />
                        </div>
                    </div>

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
                            disabled={processing}
                            className="flex-1 rounded-xl bg-cyan-500 py-3 text-sm font-bold text-black shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all hover:bg-cyan-400"
                        >
                            SAVE MATCH
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditModal;
