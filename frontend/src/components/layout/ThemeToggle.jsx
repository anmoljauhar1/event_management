import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    const prefersDark = mq ? mq.matches : false;
    const isDark = stored === 'dark' || (!stored && prefersDark);
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
    setDark(isDark);

    const handler = (e) => {
      const storedNow = localStorage.getItem('theme');
      if (storedNow) return;
      document.documentElement.dataset.theme = e.matches ? 'dark' : 'light';
      setDark(e.matches);
    };

    if (mq && mq.addEventListener) mq.addEventListener('change', handler);
    else if (mq && mq.addListener) mq.addListener(handler);

    return () => {
      if (mq && mq.removeEventListener) mq.removeEventListener('change', handler);
      else if (mq && mq.removeListener) mq.removeListener(handler);
    };
  }, []);

  const toggle = () => {
    const nextTheme = dark ? 'light' : 'dark';
    setDark(nextTheme === 'dark');
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem('theme', nextTheme);
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={dark}
      aria-label="Toggle theme"
      className="p-2 rounded-full shadow-sm transition-all"
      style={{
        backgroundColor: 'var(--surface)',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
      }}
    >
      {dark ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293a8 8 0 11-10.586-10.586A7 7 0 0017.293 13.293z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 2.47a1 1 0 111.415 1.415l-.707.707a1 1 0 11-1.415-1.415l.707-.707zM18 9a1 1 0 110 2h-1a1 1 0 110-2h1zM4.47 4.47a1 1 0 10-1.414 1.415l.707.707A1 1 0 104.47 4.47zM6 9a1 1 0 110 2H5a1 1 0 110-2h1zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
