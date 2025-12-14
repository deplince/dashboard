import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/app/components";

export const metadata: Metadata = {
  title: "Dashboard App",
  description: "Record and User Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
