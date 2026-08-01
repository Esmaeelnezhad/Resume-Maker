import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const title = "رزومه‌ساز | ساخت رزومه حرفه‌ای";
const description =
  "رزومه حرفه‌ای خود را در مرورگر بسازید، شخصی‌سازی کنید و به PDF خروجی بگیرید.";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const forwardedProtocol = requestHeaders.get("x-forwarded-proto")?.split(",")[0];
  const protocol = forwardedProtocol === "http" || forwardedProtocol === "https"
    ? forwardedProtocol
    : host.startsWith("localhost")
      ? "http"
      : "https";
  let baseUrl: URL;

  try {
    baseUrl = new URL(`${protocol}://${host}`);
  } catch {
    baseUrl = new URL("http://localhost:3000");
  }

  const socialImage = new URL("/og.png", baseUrl).toString();

  return {
    title,
    description,
    metadataBase: baseUrl,
    openGraph: {
      title,
      description,
      type: "website",
      locale: "fa_IR",
      images: [{ url: socialImage, width: 1730, height: 909, alt: "رزومه‌ساز" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
