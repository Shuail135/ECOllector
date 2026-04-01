import React, { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
    // Load theme from localStorage or system preference
    const [dark, setDark] = useState(() => {
        const saved = localStorage.getItem("theme");
        if (saved === "dark") return true;
        if (saved === "light") return false;
        // default to system
        return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    });

    // Apply/remove the class on the <html> element
    useEffect(() => {
        const root = document.documentElement; // <html>
        if (dark) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [dark]);

    return (
        <div className="dashboard-shell min-h-screen text-slate-900 transition-colors dark:text-slate-100">
            <Dashboard dark={dark} toggleDark={() => setDark((v) => !v)} />
        </div>
    );
}
