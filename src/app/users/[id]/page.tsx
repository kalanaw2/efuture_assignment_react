"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { User, Post } from "@/types";
import { fetchUser, fetchUserPosts } from "@/lib/api";

import ErrorMessage from "@/components/ErrorMessage";
import { useFavourites } from "@/context/Favouritescontext";


interface PageProps {
  params: Promise<{ id: string }>;
}

function DetailSkeleton() {
  return (
    <div className="animate-fade-in space-y-4">
      <div className="skeleton h-40 rounded-xl" />
      <div className="grid grid-cols-2 gap-4">
        <div className="skeleton h-32 rounded-xl" />
        <div className="skeleton h-32 rounded-xl" />
      </div>
      <div className="skeleton h-6 w-40 rounded mt-4" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="skeleton h-24 rounded-xl" />
      ))}
    </div>
  );
}

export default function UserDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { toggleFavourite, isFavourite } = useFavourites();

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [errorUser, setErrorUser] = useState<string | null>(null);
  const [errorPosts, setErrorPosts] = useState<string | null>(null);

  const userId = parseInt(id, 10);

  useEffect(() => {
    loadUser(userId);
    loadPosts(userId);
  }, [userId]);

  const loadUser = async (userId: number) => {
    try {
      setLoadingUser(true);
      const data = await fetchUser(userId);
      setUser(data);
    } catch (err) {
      setErrorUser(
        err instanceof Error ? err.message : "Failed to load user"
      );
    } finally {
      setLoadingUser(false);
    }
  };

  const loadPosts = async (userId: number) => {
    try {
      setLoadingPosts(true);
      const data = await fetchUserPosts(userId);
      setPosts(data);
    } catch (err) {
      setErrorPosts(
        err instanceof Error ? err.message : "Failed to load posts"
      );
    } finally {
      setLoadingPosts(false);
    }
  };

  const fav = isFavourite(userId);

  return (
    <div className="min-h-screen max-w-[860px] mx-auto px-6 py-10">
      <button
        onClick={() => router.push("/")}
        className="mb-8 flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-white animate-fade-in"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to dashboard
      </button>

      {loadingUser && <DetailSkeleton />}
      {errorUser && <ErrorMessage message={errorUser} />}

      {!loadingUser && user && (
        <div className="animate-fade-in">
          <div className="mb-5 rounded-2xl border border-[#222636] bg-[#13161e] p-6">
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0"
                    />
                  </svg>
                </div>

                <div>
                  <h1 className="text-xl font-bold text-white">{user.name}</h1>
                  <p className="text-xs font-mono text-gray-400">@{user.username}</p>
                </div>
              </div>

              <button
                onClick={() => toggleFavourite(user.id)}
                className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                  fav
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
                    : "border-indigo-500/30 bg-indigo-500/10 text-indigo-500"
                }`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill={fav ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {fav ? "Favourited" : "Add to Favourites"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  ),
                  label: "Email",
                  value: user.email,
                  mono: true,
                },
                {
                  icon: (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.57 3.4 2 2 0 0 1 3.54 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.81-.81a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  ),
                  label: "Phone",
                  value: user.phone,
                  mono: true,
                },
                {
                  icon: (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                  ),
                  label: "Website",
                  value: user.website,
                  mono: true,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-lg bg-[#1a1e28] p-3"
                >
                  <span className="text-indigo-500">{item.icon}</span>
                  <div className="min-w-0">
                    <p className="mb-0.5 text-xs text-gray-400">{item.label}</p>
                    <p
                      className={`truncate text-sm text-gray-300 ${
                        item.mono ? "font-mono text-xs" : ""
                      }`}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#222636] bg-[#13161e] p-5">
              <div className="mb-4 flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="text-indigo-500"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Address
                </span>
              </div>

              {[
                ["Street", `${user.address.street}, ${user.address.suite}`],
                ["City", user.address.city],
                ["Zipcode", user.address.zipcode],
                ["Coordinates", `${user.address.geo.lat}, ${user.address.geo.lng}`],
              ].map(([label, val]) => (
                <div
                  key={label}
                  className="flex justify-between border-b border-[#222636] py-2"
                >
                  <span className="text-xs text-gray-400">{label}</span>
                  <span className="max-w-[55%] text-right text-xs text-gray-300">
                    {val}
                  </span>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-[#222636] bg-[#13161e] p-5">
              <div className="mb-4 flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="text-indigo-500"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Company
                </span>
              </div>

              {[
                ["Name", user.company.name],
                ["Catchphrase", user.company.catchPhrase],
                ["Business", user.company.bs],
              ].map(([label, val]) => (
                <div
                  key={label}
                  className="flex flex-col border-b border-[#222636] py-2"
                >
                  <span className="mb-0.5 text-xs text-gray-400">{label}</span>
                  <span className="text-xs text-gray-300">{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-5 flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="text-indigo-500"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>

              <h2 className="font-semibold text-white">Posts</h2>

              {!loadingPosts && (
                <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-500">
                  {posts.length}
                </span>
              )}
            </div>

            {loadingPosts && (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="skeleton h-24 rounded-xl" />
                ))}
              </div>
            )}

            {errorPosts && <ErrorMessage message={errorPosts} />}

            {!loadingPosts && !errorPosts && (
              <div className="space-y-3">
                {posts.map((post, idx) => (
                  <div
                    key={post.id}
                    className="animate-fade-in rounded-xl border border-[#222636] bg-[#13161e] p-4"
                  >
                    <p className="mb-2 text-sm font-medium capitalize text-white">
                      {post.title}
                    </p>
                    <p className="text-xs leading-relaxed text-gray-400">
                      {post.body}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}