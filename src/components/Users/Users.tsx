"use client";

import { useState, useEffect } from "react";
import { User } from "@/types";
import TableSkeleton from "../Tableskeleton";
import ErrorMessage from "../ErrorMessage";
import { fetchUsers } from "@/lib/api";
import UserTable from "./Usertable";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      console.log("users", data)
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div
      className="min-h-screen px-6 py-10"
      style={{ maxWidth: "1100px", margin: "0 auto" }}
    >
      {/* Header */}
      <header className="mb-10 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--accent-soft)", border: "1px solid var(--accent-glow)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            User Dashboard
          </h1>
        </div>
        <p className="text-sm ml-11" style={{ color: "var(--text-muted)" }}>
          Browse, search, and manage your user directory
        </p>
      </header>

      {/* Stats bar */}
      {!loading && !error && (
        <div
          className="grid grid-cols-3 gap-4 mb-8 animate-fade-in"
        >
          {[
            { label: "Total Users", value: users.length, icon: "👤" },
            { label: "Companies", value: new Set(users.map(u => u.company.name)).size, icon: "🏢" },
            { label: "Cities", value: new Set(users.map(u => u.address.city)).size, icon: "🌆" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="px-5 py-4 rounded-xl"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="text-xl mb-1">{stat.icon}</div>
              <div
                className="text-2xl font-bold mb-0.5"
                style={{ color: "var(--text-primary)" }}
              >
                {stat.value}
              </div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      {loading && <TableSkeleton />}
      {error && <ErrorMessage message={error} />}
      {!loading && !error && <UserTable users={users} />}
    </div>
  );
}