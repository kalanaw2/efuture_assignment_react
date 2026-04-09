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

        return q
            ? users.filter(
                (u) =>
                    u.name.toLowerCase().includes(q) ||
                    u.email.toLowerCase().includes(q)
            )
            : users;
    }, [users, search]);

    return (
        <div className="animate-fade-in">

            <div className="relative mb-5">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    🔍
                </span>

                <input
                    type="text"
                    placeholder="Search by name or email…"
                    value={searchRaw}
                    onChange={(e) => setSearchRaw(e.target.value)}
                    className="w-full rounded-lg border border-[#222636] bg-[#13161e] py-3 pl-10 pr-4 text-sm text-white placeholder:text-gray-500 focus:border-indigo-500 outline-none"
                />
            </div>


            <p className="mb-3 text-xs text-gray-500">
                {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} found
            </p>


            <div className="overflow-hidden rounded-lg border border-[#222636]">
                <table className="w-full text-sm">

                    <thead className="bg-[#13161e] border-b border-[#222636] text-gray-400 uppercase text-xs tracking-wider">
                        <tr>
                            <th className="w-10 px-4 py-3"></th>
                            <th className="text-left px-4 py-3">Name</th>
                            <th className="text-left px-4 py-3">Email</th>
                            <th className="text-left px-4 py-3">Company</th>
                            <th className="text-left px-4 py-3">City</th>
                        </tr>
                    </thead>


                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="py-10 text-center text-gray-500"
                                >
                                    No users match your search.
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user, idx) => {
                                const fav = isFavourite(user.id);

                                return (
                                    <tr
                                        key={user.id}
                                        onClick={() => router.push(`/users/${user.id}`)}
                                        className={`cursor-pointer transition-colors hover:bg-[#1a1e28] ${fav ? "bg-indigo-500/10" : ""
                                            }`}
                                    >

                                        <td className="px-4 py-3">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFavourite(user.id);
                                                }}
                                                className={`hover:scale-110 transition ${fav ? "text-amber-500" : "text-gray-500"
                                                    }`}
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
                                        </td>


                                        <td className="px-4 py-3 font-medium text-white">
                                            {user.name}
                                        </td>


                                        <td className="px-4 py-3 text-xs text-gray-300 font-mono">
                                            {user.email}
                                        </td>


                                        <td className="px-4 py-3 text-gray-300">
                                            {user.company.name}
                                        </td>


                                        <td className="px-4 py-3 text-gray-300">
                                            {user.address.city}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}