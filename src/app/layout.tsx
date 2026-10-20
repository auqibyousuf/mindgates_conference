import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  title: "Mindgates Research conference forum | Elevating Scholarly Excellence",
  description: "A premier organization for scholarly study, facilitating National and International Conferences and academic publishing.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased min-h-screen flex flex-col"
        suppressHydrationWarning
      >
        <ToastProvider>
          <main className="grow">
            {children}
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
