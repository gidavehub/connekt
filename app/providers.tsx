'use client';

import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        // Enforce light theme app-wide. Do not enable system preference.
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            {children}
        </ThemeProvider>
    );
}
