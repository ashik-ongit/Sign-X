import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignX",
  description: "Real-time sign language avatar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}