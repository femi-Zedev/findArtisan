export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const storage = localStorage.getItem('findartisan-theme');
              if (storage) {
                const parsedStorage = JSON.parse(storage);
                // Zustand persist stores data as { state: { theme: 'dark' } }
                const theme = parsedStorage?.state?.theme;
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                }
              } else {
                // Default to dark mode if no preference is stored
                document.documentElement.classList.add('dark');
              }
            } catch (e) {
              // If there's any error, default to dark mode
              document.documentElement.classList.add('dark');
            }
          })();
        `,
      }}
    />
  );
}

