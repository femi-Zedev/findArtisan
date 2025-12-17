export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const storage = localStorage.getItem('findartisan-theme');
              const getSystemTheme = () => {
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              };
              
              let effectiveTheme = getSystemTheme(); // Default to system preference
              
              if (storage) {
                const parsedStorage = JSON.parse(storage);
                // Zustand persist stores data as { state: { theme: 'dark' | 'light' | 'system' } }
                const theme = parsedStorage?.state?.theme;
                if (theme === 'dark' || theme === 'light') {
                  effectiveTheme = theme;
                } else if (theme === 'system') {
                  effectiveTheme = getSystemTheme();
                }
              }
              
              if (effectiveTheme === 'dark') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (e) {
              // If there's any error, default to system preference
              const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              if (isDark) {
                document.documentElement.classList.add('dark');
              }
            }
          })();
        `,
      }}
    />
  );
}

