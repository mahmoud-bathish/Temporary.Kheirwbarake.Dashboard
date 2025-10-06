import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "لوحة تحكم العناصر غير المربحة",
  description: "عرض وتحليل العناصر غير المربحة في المخزن",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-between h-16">
              <div className="flex items-center gap-6">
                <Link href="/" className="text-gray-700 hover:text-gray-900 text-sm font-medium cursor-pointer">العناصر غير المربحة</Link>
                <Link href="/barcode" className="text-gray-700 hover:text-gray-900 text-sm font-medium cursor-pointer">تحقق من الباركود</Link>
              </div>
              <div className="text-sm text-gray-500">لوحة التحكم</div>
            </nav>
          </div>
        </header>
        <main className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
