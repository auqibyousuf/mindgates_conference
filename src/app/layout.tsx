import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mindgates Research conference forum | Elevating Scholarly Excellence",
  description: "A premier organization for scholarly study, facilitating National and International Conferences and academic publishing.",
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
        <main className="grow">
          {children}
        </main>
      </body>
    </html>
  );
}
