import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RegWatch — AI-Powered Compliance for Australian Businesses",
  description:
    "Never miss a compliance deadline. RegWatch tracks your regulatory obligations, sends smart reminders, and provides AI-powered recommendations tailored to your business.",
  keywords: [
    "compliance",
    "Australian business",
    "regulatory",
    "ATO",
    "BAS",
    "deadlines",
    "reminders",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <TooltipProvider delay={300}>
          {children}
          <Toaster richColors position="top-right" />
        </TooltipProvider>
      </body>
    </html>
  );
}
