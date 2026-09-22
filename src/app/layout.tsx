import { Fraunces, Outfit } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { store } from "@/data/store";
import { CartProvider } from "@/components/cart/CartProvider";
import { CustomerStoreLayout } from "@/components/layout/CustomerStoreLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { AntiDarkModeGuardian } from "@/components/common/AntiDarkModeGuardian";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const body = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#DCE8DC",
};

export const metadata: Metadata = {
  title: {
    default: `${store.name} · Cosmetics in ${store.city}`,
    template: `%s · ${store.name}`,
  },
  description: `${store.name} in ${store.address}. Browse beauty products, order online or on WhatsApp, and get city delivery in Pali.`,
  metadataBase: new URL("http://localhost:3000"),
  other: {
    "color-scheme": "light",
    "supported-color-schemes": "light",
    "darkreader-lock": "true",
  },
  openGraph: {
    title: store.name,
    description: store.tagline,
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" style={{ colorScheme: "light" }}>
      <head>
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        <meta name="darkreader-lock" content="true" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var root = document.documentElement;
                  root.classList.remove('dark', 'dark-mode', 'dark-theme', 'theme-dark');
                  root.setAttribute('data-theme', 'light');
                  root.setAttribute('data-mode', 'light');
                  root.style.setProperty('color-scheme', 'light', 'important');
                  root.style.setProperty('forced-color-adjust', 'none', 'important');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${display.variable} ${body.variable}`}>
        <AntiDarkModeGuardian />
        <CartProvider>
          <JsonLd />
          <CustomerStoreLayout>{children}</CustomerStoreLayout>
        </CartProvider>
      </body>
    </html>
  );
}

