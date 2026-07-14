import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Metaphoric Cards",
  description: "Pick your cards.",
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
