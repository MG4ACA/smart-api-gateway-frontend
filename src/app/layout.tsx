import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/components/ReduxProvider";
import { AuthInitializer } from "@/components/AuthInitializer";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Smart Recipe Gateway",
  description: "Discover, save, and enjoy delicious recipes from around the world",
  keywords: ["recipes", "cooking", "food", "meals", "ingredients"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <ReduxProvider>
          <AuthInitializer>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </AuthInitializer>
        </ReduxProvider>
      </body>
    </html>
  );
}
