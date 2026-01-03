import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import Script from "next/script";
import { createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@/styles/mantine-style.css";
import "@/styles/phone-input.css";
import "@/app/globals.css";
import { Providers } from "@/providers/global-providers";
import { ThemeScript } from "@/app/_components/theme-script";

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
  fontSizes: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px - Our default for inputs
    md: '0.875rem',  // 14px - Changed from 16px default
    lg: '1rem',      // 16px
    xl: '1.25rem',   // 20px
  },
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
      defaultProps: {
        size: 'md', // Use md which is now 14px
      },
      styles: {
        input: {
          borderRadius: '0.75rem',
          fontSize: '0.875rem', // 14px
        }
      }
    },
    DateInput: {
      defaultProps: {
        size: 'md',
      },
      styles: {
        input: {
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
        }
      }
    },
    Select: {
      defaultProps: {
        size: 'md',
      },
      styles: {
        input: {
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
        }
      }
    },
    TextInput: {
      defaultProps: {
        size: 'md',
      },
      styles: {
        input: {
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
        }
      }
    },
    Textarea: {
      defaultProps: {
        size: 'md',
      },
      styles: {
        input: {
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
        }
      }
    },
    MultiSelect: {
      defaultProps: {
        size: 'md',
      },
      styles: {
        input: {
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
        }
      }
    },
    Autocomplete: {
      defaultProps: {
        size: 'md',
      },
      styles: {
        input: {
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
        }
      }
    },
    PasswordInput: {
      defaultProps: {
        size: 'md',
      },
      styles: {
        input: {
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
        }
      }
    },
    NumberInput: {
      defaultProps: {
        size: 'md',
      },
      styles: {
        input: {
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
        }
      }
    },
  }
});

export const metadata: Metadata = {
  title: "FindArtisan - Découvrez les artisans locaux au Bénin",
  description: "Découvrez les artisans locaux au Bénin et contactez-les facilement",
  applicationName: "FindArtisan",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "FindArtisan",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
          <ThemeScript />
      </head>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <MantineProvider theme={theme} defaultColorScheme="auto">
          <NuqsAdapter>
            <Providers>
              <Notifications />
              <Suspense fallback={null}>
                {children}
              </Suspense>
            </Providers>
          </NuqsAdapter>
        </MantineProvider>
        <Script
          src="https://t.contentsquare.net/uxa/b96d35515161d.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
