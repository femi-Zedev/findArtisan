import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@/styles/mantine-style.css";
import "./globals.css";
import { ThemeScript } from "./_components/theme-script";
import { Providers } from "@/providers/global-providers";

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
  },
  fontFamily: 'var(--font-inter), sans-serif',
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
    }
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
          <Providers>
            <Notifications />
            {children}
          </Providers>
        </MantineProvider>
      </body>
    </html>
  );
}
