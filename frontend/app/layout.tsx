import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import { createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@/styles/mantine-style.css";
import "./globals.css";
import { ThemeScript } from "./_components/theme-script";
import { Providers } from "@/providers/global-providers";
import { Navbar } from "./_components/navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Create a custom theme that aligns with our existing design system
const theme = createTheme({
  primaryColor: 'teal',
  primaryShade: 6,
  colors: {
    teal: [
      "#f0fdfa", // 0 - teal-50
      "#ccfbf1", // 1 - teal-100
      "#99f6e4", // 2 - teal-200
      "#5eead4", // 3 - teal-300
      "#2dd4bf", // 4 - teal-400
      "#14b8a6", // 5 - teal-500
      "#0d9488", // 6 - teal-600
      "#0f766e", // 7 - teal-700
      "#115e59", // 8 - teal-800
      "#134e4a"  // 9 - teal-900
    ],
    // Custom dark mode grays matching Tailwind
    dark: [
      "#e5e7eb", // 0 - gray-200
      "#d1d5db", // 1 - gray-300
      "#9ca3af", // 2 - gray-400
      "#6b7280", // 3 - gray-500
      "#4b5563", // 4 - gray-600
      "#374151", // 5 - gray-700
      "#1f2937", // 6 - gray-800
      "#111827", // 7 - gray-900
      "#0f172a", // 8 - slate-900
      "#020617", // 9 - slate-950
    ],
  },
  fontFamily: 'var(--font-inter), sans-serif',
  autoContrast: true,
  luminanceThreshold: 0.3,
  components: {
    Button: {
      defaultProps: {
        radius: 'lg', // 16px (1rem)
      },
    },
    Switch: {
      defaultProps: {
        withThumbIndicator: false,
      },
    },
    Input: {
      styles: {
        input: {
          borderRadius: '0.75rem',
        }
      }
    },
    DateInput: {
      styles: {
        input: {
          borderRadius: '0.75rem',
        }
      }
    },
    Select: {
      styles: {
        input: {
          borderRadius: '0.75rem',
        }
      }
    },
    TextInput: {
      styles: {
        input: {
          borderRadius: '0.75rem',
        }
      }
    },
    Textarea: {
      styles: {
        input: {
          borderRadius: '0.75rem',
        }
      }
    },
    MultiSelect: {
      styles: {
        input: {
          borderRadius: '0.75rem',
        }
      }
    },
    Autocomplete: {
      styles: {
        input: {
          borderRadius: '0.75rem',
        }
      }
    },
  }
});

export const metadata: Metadata = {
  title: "FindArtisan - Discover Local Artisans",
  description: "Find local artisans in Benin Republic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <MantineProvider theme={theme}>
          <NuqsAdapter>
            <Providers>
              <Notifications />
              <main className="relative min-h-screen bg-linear-to-b from-blue-50 to-gray-50 dark:from-gray-950 dark:to-gray-900">
                <Suspense fallback={null}>
                  <Navbar />
                  {children}
                </Suspense>
              </main>
            </Providers>
          </NuqsAdapter>
        </MantineProvider>
      </body>
    </html>
  );
}
