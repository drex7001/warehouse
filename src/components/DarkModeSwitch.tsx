import React, { useEffect, useState } from "react";

const DarkModeSwitch = () => {
  const [enabled, setEnabled] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (enabled) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [enabled]);

  return (
    <button
      className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
      onClick={() => setEnabled((v) => !v)}
    >
      {enabled ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
};

export default DarkModeSwitch;