'use client';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored) {
        document.documentElement.classList.remove('theme-dark', 'theme-light');
        document.documentElement.classList.add(stored);
        setTheme(stored);
      } else {
        // default to system pref
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const t = prefersDark ? 'theme-dark' : 'theme-light';
        document.documentElement.classList.add(t);
        setTheme(t);
      }
    } catch (e) {}
  }, []);

  function toggle() {
    const next = theme === 'theme-dark' ? 'theme-light' : 'theme-dark';
    document.documentElement.classList.remove('theme-dark', 'theme-light');
    document.documentElement.classList.add(next);
    localStorage.setItem('theme', next);
    setTheme(next);
  }

  return (
    <button onClick={toggle} aria-label="Toggle theme" className="p-2 rounded-full bg-transparent border">
      {theme === 'theme-dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}
