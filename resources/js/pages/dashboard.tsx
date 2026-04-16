import { useForm, usePage, Head } from '@inertiajs/react';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { AddPlayerModal, Navbar } from '@/components';
import { PlayerDeleteModal } from '@/components';

interface Role {
    id: number;
    role: string;
}

interface Player {
    id: number;
    name: string;
    email: string;
    roles: Role[];
}

function Dashboard() {
    const { post } = useForm();
    const { players, auth } = usePage().props;
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

    const isManager = auth.user.roles.includes('manager');

    // Add Player Form

    // Edit Player Form
    const editForm = useForm({
        name: '',
        email: '',
    });

    if (!Array.isArray(players)) {
        return;
    }

    const handleEditSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedPlayer) {
            return;
        }

        editForm.post(`/api/player/${selectedPlayer.id}/edit`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                setSelectedPlayer(null);
            },
        });
    };

    const handleDelete = (player: Player) => {
        setIsDeleteModalOpen(true);
        setSelectedPlayer(player);
    };

    const handleSetLeader = (id: number) => {
        post(`/api/player/${id}/leader`);
    };

    const openEditModal = (player: Player) => {
        setSelectedPlayer(player);
        editForm.setData({
            name: player.name,
            email: player.email,
        });
        setIsEditModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100">
            <Head title="Team Management" />

            <div className="relative z-10 mx-auto max-w-6xl px-4 pb-16 sm:px-6">
                <Navbar />

                <main className="mt-8">
                    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="text-3xl font-black tracking-tighter text-white">
                                Team{' '}
                                <span className="text-cyan-400">
                                    Management
                                </span>
                            </h2>
                            <p className="text-sm text-neutral-400">
                                Manage your roster, assign leaders, and handle
                                player accounts.
                            </p>
                        </div>

                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-black shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all hover:scale-[1.02] hover:bg-cyan-400 active:scale-[0.98]"
                        >
                            <span>+</span> ADD PLAYER
                        </button>
                    </div>

                    {/* Players Table */}
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-md">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-white/10 bg-white/5 text-xs font-bold tracking-widest text-neutral-400 uppercase">
                                    <tr>
                                        <th className="px-6 py-4">Player</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {players.length > 0 ? (
                                        players.map((player) => (
                                            <tr
                                                key={player.id}
                                                className="group transition-colors hover:bg-white/2"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-neutral-800 to-neutral-700 text-lg font-bold">
                                                            {player.name[0].toUpperCase()}
                                                        </div>
                                                        <span className="font-bold text-white transition-colors group-hover:text-cyan-400">
                                                            {player.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-neutral-400">
                                                    {player.email}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        {player.roles.map(
                                                            (
                                                                r: Role,
                                                                i: number,
                                                            ) => (
                                                                <span
                                                                    key={i}
                                                                    className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-tighter uppercase ${
                                                                        r.role ===
                                                                        'leader'
                                                                            ? 'border border-amber-500/20 bg-amber-500/20 text-amber-400'
                                                                            : 'border border-cyan-500/20 bg-cyan-500/10 text-cyan-400'
                                                                    }`}
                                                                >
                                                                    {r.role}
                                                                </span>
                                                            ),
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {isManager &&
                                                            !player.roles.some(
                                                                (r: Role) =>
                                                                    r.role ===
                                                                    'leader',
                                                            ) && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleSetLeader(
                                                                            player.id,
                                                                        )
                                                                    }
                                                                    className="rounded-lg bg-white/5 p-2 text-neutral-400 transition-all hover:bg-amber-500/20 hover:text-amber-400"
                                                                    title="Promote to Leader"
                                                                >
                                                                    👑
                                                                </button>
                                                            )}
                                                        <button
                                                            onClick={() =>
                                                                openEditModal(
                                                                    player,
                                                                )
                                                            }
                                                            className="rounded-lg bg-white/5 p-2 text-neutral-400 transition-all hover:bg-cyan-500/20 hover:text-cyan-400"
                                                            title="Edit Details"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                className="h-4 w-4"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                                />
                                                            </svg>
                                                        </button>
                                                        {isManager && (
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        player,
                                                                    )
                                                                }
                                                                className="rounded-lg bg-white/5 p-2 text-neutral-400 transition-all hover:bg-rose-500/20 hover:text-rose-400"
                                                                title="Delete Player"
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-4 w-4"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-6 py-12 text-center text-neutral-500"
                                            >
                                                No players found in the roster.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
            {isAddModalOpen && (
                <AddPlayerModal setIsAddModalOpen={setIsAddModalOpen} />
            )}

            {/* Edit Player Modal */}
            {isEditModalOpen && selectedPlayer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    <div className="animate-in fade-in zoom-in w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-8 shadow-2xl duration-200">
                        <h3 className="mb-6 text-2xl font-black tracking-tight text-white uppercase italic">
                            Edit <span className="text-cyan-400">Player</span>
                        </h3>
                        <form
                            onSubmit={handleEditSubmit}
                            className="flex flex-col gap-4"
                        >
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={editForm.data.name}
                                    onChange={(e) =>
                                        editForm.setData('name', e.target.value)
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm transition-colors outline-none focus:border-cyan-500/50"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={editForm.data.email}
                                    onChange={(e) =>
                                        editForm.setData(
                                            'email',
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm transition-colors outline-none focus:border-cyan-500/50"
                                    required
                                />
                            </div>
                            <div className="mt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditModalOpen(false);
                                        setSelectedPlayer(null);
                                    }}
                                    className="flex-1 rounded-xl bg-white/5 py-3 text-sm font-bold transition-colors hover:bg-white/10"
                                >
                                    CANCEL
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="flex-1 rounded-xl bg-cyan-500 py-3 font-mono text-sm font-bold text-black italic shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all hover:bg-cyan-400 disabled:opacity-50"
                                >
                                    {editForm.processing
                                        ? 'SAVING...'
                                        : 'SAVE CHANGES'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {isDeleteModalOpen &&
                typeof document !== 'undefined' &&
                createPortal(
                    <PlayerDeleteModal
                        setIsModalOpen={setIsDeleteModalOpen}
                        deleteId={selectedPlayer?.id}
                    />,
                    document.body,
                )}
        </div>
    );
}

export default Dashboard;
