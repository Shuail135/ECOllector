import React from "react";
import { motion } from "motion/react";
import logo from "../assets/logo.png";

export default function TopBar({ dark, toggleDark }) {
    return (
        <header className="sticky top-0 z-30 border-b border-white/45 bg-white/35 backdrop-blur-xl dark:border-white/8 dark:bg-slate-950/28">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
                <div className="flex items-center gap-4">
                    <img
                        src={logo}
                        alt="ECOllector Logo"
                        className="h-14 w-14 rounded-[1.4rem] border border-white/60 bg-white/70 object-cover p-1.5 shadow-[0_14px_32px_rgba(15,23,42,0.14)] dark:border-white/10 dark:bg-slate-900/55"
                    />
                    <div>
                        <p className="ui-meta text-[0.68rem] uppercase tracking-[0.24em]">
                            Operations Dashboard
                        </p>
                        <h1 className="ui-heading text-lg leading-tight md:text-xl">
                            ECOllector
                        </h1>
                        <p className="ui-subtitle text-sm">
                            Live recycling intelligence
                        </p>
                    </div>
                </div>

                <motion.button
                    onClick={toggleDark}
                    className="control-button"
                    title="Toggle dark mode"
                    whileHover={{ y: -1.5, scale: 1.01 }}
                    whileTap={{ scale: 0.985 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                >
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white dark:bg-white dark:text-slate-900">
                        {dark ? "D" : "L"}
                    </span>
                    {dark ? "Dark Mode" : "Light Mode"}
                </motion.button>
            </div>
        </header>
    );
}
