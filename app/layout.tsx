import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import StyledEngineProvider from "@mui/material/StyledEngineProvider";
import { Header } from "@/components";
import Footer from "@/components/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SME Health - Get Started",
  description: "SME Health - Get Started",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 duration-150 !min-h-screen`}
      >
        <StyledEngineProvider injectFirst>
          <AppRouterCacheProvider>
            <Header />
            {children}
            <Footer />
          </AppRouterCacheProvider>
        </StyledEngineProvider>
      </body>
    </html>
  );
}
