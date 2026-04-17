import { useForm } from '@inertiajs/react';
import React from 'react';

type Props = {
    setAuthModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function AuthModal({ setAuthModalOpen }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/api/login', {
            onSuccess: () => setAuthModalOpen(false),
        });
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-bold tracking-widest text-white uppercase">
                        Manager Login
                    </h3>
                    <button
                        onClick={() => setAuthModalOpen(false)}
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
                            Email
                        </label>
                        <input
                            type="text"
                            value={data.email}
                            onChange={(e) =>
                                setData('email', e.target.value)
                            }
                            placeholder="e.g. VCT Finals"
                            className={`w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white transition-colors outline-none focus:border-cyan-500/50 focus:bg-white/10 ${
                                errors.email ? 'border-red-500/50' : ''
                            }`}
                        />
                        {errors.email && (
                            <span className="text-xs font-semibold text-red-500">
                                {errors.email}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-neutral-400 uppercase">
                            Password
                        </label>
                        <input
                            type="text"
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            placeholder="e.g. VCT Finals"
                            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white transition-colors outline-none focus:border-cyan-500/50 focus:bg-white/10"
                        />
                    </div>

                    <div className="mt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={() => setAuthModalOpen(false)}
                            className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-bold text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            CANCEL
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 rounded-xl bg-cyan-500 py-3 text-sm font-bold text-black shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all hover:bg-cyan-400"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AuthModal;
