export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              const getSystemTheme = () => {
                return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
              };
              
              const storage = localStorage.getItem('findartisan-theme-color-scheme');
              let scheme = 'auto';
              
              if (storage) {
                try {
                  const parsed = JSON.parse(storage);
                  scheme = parsed?.state?.theme || parsed || 'auto';
                } catch {
                  scheme = storage;
                }
              }
              
              const effectiveScheme = scheme === 'auto' ? getSystemTheme() : scheme;
              document.documentElement.setAttribute('data-mantine-color-scheme', effectiveScheme);
            } catch (e) {
              const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              document.documentElement.setAttribute('data-mantine-color-scheme', isDark ? 'dark' : 'light');
            }
          })();
        `,
      }}
    />
  );
}

