import { useForm } from '@inertiajs/react';
import React from 'react';

interface Props {
    setIsAddModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddPlayerModal({ setIsAddModalOpen }: Props) {
    const { data, setData, processing, post, reset } = useForm({
        name: '',
        email: '',
        password: '',
    });

    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/api/player/add', {
            onSuccess: () => {
                setIsAddModalOpen(false);
                reset();
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="animate-in fade-in zoom-in w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-8 shadow-2xl duration-200">
                <h3 className="mb-6 text-2xl font-black tracking-tight text-white uppercase italic">
                    Add New <span className="text-cyan-400">Player</span>
                </h3>
                <form
                    onSubmit={handleAddSubmit}
                    className="flex flex-col gap-4"
                >
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">
                            Name
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm transition-colors outline-none focus:border-cyan-500/50"
                            placeholder="Enter player name"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">
                            Email
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm transition-colors outline-none focus:border-cyan-500/50"
                            placeholder="player@example.com"
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">
                            Initial Password
                        </label>
                        <input
                            type="password"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm transition-colors outline-none focus:border-cyan-500/50"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div className="mt-6 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(false)}
                            className="flex-1 rounded-xl bg-white/5 py-3 text-sm font-bold transition-colors hover:bg-white/10"
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 rounded-xl bg-cyan-500 py-3 font-mono text-sm font-bold text-black italic shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all hover:bg-cyan-400 disabled:opacity-50"
                        >
                            {processing ? 'ADDING...' : 'CONFIRM ADD'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddPlayerModal;
