import React from "react";
import logo from "../assets/logo.png";

export default function TopBar({ dark, toggleDark }) {
    return (
        <header className="sticky top-0 z-20 border-b border-white/40 dark:border-white/10 bg-white/60 dark:bg-[#2b2b2b]/80 backdrop-blur-md">
            <div className="mx-auto max-w-6xl px-4 md:px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        src={logo}
                        alt="ECOllector Logo"
                        className="h-10 w-10 rounded-xl shadow-soft object-cover"
                    />
                    <div>
                        <h1 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white leading-tight">
                            ECOllector
                        </h1>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Demo UI — no backend</p>
                    </div>
                </div>

                <button
                    onClick={toggleDark}
                    className="rounded-xl border border-white/50 dark:border-white/10 bg-white/60 dark:bg-white/10 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-white/80 dark:hover:bg-white/20 transition shadow-soft"
                    title="Toggle dark mode"
                >
                    {dark ? "🌙 Dark" : "☀️ Light"}
                </button>
            </div>
        </header>
    );
}
