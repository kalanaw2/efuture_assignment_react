"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { useDebounce } from "@/hooks/Usedebounce";
import { useFavourites } from "@/context/Favouritescontext";


interface UserTableProps {
    users: User[];
}

export default function UserTable({ users }: UserTableProps) {
    const router = useRouter();
    const { toggleFavourite, isFavourite } = useFavourites();
    const [searchRaw, setSearchRaw] = useState("");
    const search = useDebounce(searchRaw, 300);

    const filteredUsers = useMemo(() => {
        const q = search.toLowerCase().trim();
        const filtered = q
            ? users.filter(
                (u) =>
                    u.name.toLowerCase().includes(q) ||
                    u.email.toLowerCase().includes(q)
            )
            : users;

        // Favourites float to top
        return [...filtered].sort((a, b) => {
            const af = isFavourite(a.id) ? 0 : 1;
            const bf = isFavourite(b.id) ? 0 : 1;
            return af - bf;
        });
    }, [users, search, isFavourite]);

    return (
        <div className="animate-fade-in">

            <div className="mb-5 relative">
                <span
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                    aria-hidden="true"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                </span>
                <input
                    type="text"
                    placeholder="Search by name or email…"
                    value={searchRaw}
                    onChange={(e) => setSearchRaw(e.target.value)}
                    className="
                            w-full pl-10 pr-4 py-3 text-sm outline-none transition-colors bg-[#13161e]
                            text-[#f0f2f8]
                            border border-[#222636]
                            rounded-[10px]
                            placeholder:text-[#545870]
                            focus:border-[#6366f1]
                        "
                />
                {searchRaw && (
                    <button
                        onClick={() => setSearchRaw("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                    </button>
                )}
            </div>


            <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} found
            </p>


            <div
                style={{
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    overflow: "hidden",
                }}
            >

                {/* <div
                    style={{
                        background: "var(--bg-card)",
                        borderBottom: "1px solid var(--border)",
                    }}
                    className="grid grid-cols-[2.5rem_1fr_1fr_1fr_1fr] px-4 py-3"
                >
                    <span />
                    {["Name", "Email", "Company", "City"].map((h) => (
                        <span
                            key={h}
                            className="text-xs font-semibold uppercase tracking-widest"
                            style={{ color: "var(--text-muted)" }}
                        >
                            {h}
                        </span>
                    ))}
                </div> */}


                {filteredUsers.length === 0 ? (
                    <div
                        className="py-16 text-center text-sm"
                        style={{ color: "var(--text-muted)", background: "var(--bg-card)" }}
                    >
                        No users match your search.
                    </div>
                ) : (
                    filteredUsers.map((user, idx) => {
                        const fav = isFavourite(user.id);
                        return (
                            <div
                                key={user.id}
                                onClick={() => router.push(`/users/${user.id}`)}
                                style={{
                                    borderBottom:
                                        idx < filteredUsers.length - 1
                                            ? "1px solid var(--border)"
                                            : "none",
                                    background: fav ? "var(--accent-soft)" : "transparent",
                                    animationDelay: `${idx * 30}ms`,
                                }}
                                className="animate-fade-in grid grid-cols-[2.5rem_1fr_1fr_1fr_1fr] px-4 py-4 cursor-pointer hover:bg-[var(--bg-hover)] transition-colors group"
                            >
                                {/* Favourite star */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavourite(user.id);
                                    }}
                                    title={fav ? "Remove from favourites" : "Add to favourites"}
                                    className="flex items-center justify-center transition-transform hover:scale-125"
                                    style={{ color: fav ? "var(--gold)" : "var(--text-muted)" }}
                                >
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill={fav ? "currentColor" : "none"}
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                </button>

                                {/* Name */}
                                <div className="flex items-center gap-2 pr-4">

                                    <span
                                        className="text-sm font-medium truncate group-hover:text-[var(--accent)] transition-colors"
                                        style={{ color: "var(--text-primary)" }}
                                    >
                                        {user.name}
                                    </span>
                                </div>

                                {/* Email */}
                                <span
                                    className="text-sm truncate pr-4 self-center"
                                    style={{ color: "var(--text-secondary)", fontFamily: "var(--font-mono)", fontSize: "0.75rem" }}
                                >
                                    {user.email}
                                </span>

                                {/* Company */}
                                <span
                                    className="text-sm truncate pr-4 self-center"
                                    style={{ color: "var(--text-secondary)" }}
                                >
                                    {user.company.name}
                                </span>

                                {/* City */}
                                <div className="flex items-center gap-1.5 self-center">
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)", flexShrink: 0 }}>
                                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                                        {user.address.city}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}

            </div>
        </div>
    );
}