import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { StructuredData } from "@/components/seo/structured-data";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#1e40af",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RegWatch",
  },
  icons: {
    apple: "/apple-touch-icon.png",
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU" suppressHydrationWarning>
      <head>
        <StructuredData />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ServiceWorkerRegistration />
        {/* Skip navigation link for screen reader and keyboard users */}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <TooltipProvider delay={300}>
          {children}
          <Toaster richColors position="top-right" />
          <InstallPrompt />
        </TooltipProvider>
      </body>
    </html>
  );
}
