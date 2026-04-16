import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import AuthModal from './authmodal';

function Navbar() {
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const { auth } = usePage().props;

    return (
        <header className="mb-8 flex flex-col items-center justify-between gap-4 border-b border-white/10 py-6 sm:flex-row">
            <div
                onClick={() => {
                    window.location.href = '/';
                }}
                className="flex cursor-pointer items-center gap-3"
            >
                <div className="group relative flex h-10 w-10 -skew-x-12 transform items-center justify-center overflow-hidden rounded-xl bg-white shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    <div className="absolute inset-0 translate-y-full bg-black/5 transition-transform duration-300 group-hover:translate-y-0"></div>
                    <svg
                        className="absolute h-6 w-6 skew-x-12 transform text-black"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                    </svg>
                </div>
                <h1 className="bg-linear-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text font-mono text-2xl font-black tracking-widest text-transparent italic sm:text-3xl">
                    Nxt<span className="text-white">Match</span>
                </h1>
            </div>

            <div className="flex w-full items-center justify-center gap-3 sm:w-auto">
                {!auth.user ? (
                    <>
                        <button
                            onClick={() => setAuthModalOpen(true)}
                            className="flex-1 rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all hover:from-cyan-400 hover:to-blue-500 hover:shadow-[0_0_30px_rgba(34,211,238,0.8)] sm:flex-none"
                        >
                            LOGIN
                        </button>
                    </>
                ) : (
                    <>
                        {auth.user?.roles?.includes('manager') && (
                            <form action="/player/add" method="GET">
                                <button className="flex-1 rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all hover:from-cyan-400 hover:to-blue-500 hover:shadow-[0_0_30px_rgba(34,211,238,0.8)] sm:flex-none">
                                    Manage Players
                                </button>
                            </form>
                        )}
                        <form action="/api/logout" method="POST">
                            <button className="flex-1 rounded-lg bg-linear-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all hover:from-cyan-400 hover:to-blue-500 hover:shadow-[0_0_30px_rgba(34,211,238,0.8)] sm:flex-none">
                                LOGOUT
                            </button>
                        </form>
                    </>
                )}
            </div>

            {authModalOpen &&
                typeof document !== 'undefined' &&
                createPortal(
                    <AuthModal setAuthModalOpen={setAuthModalOpen} />,
                    document.body,
                )}
        </header>
    );
}

export default Navbar;
