import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "@/styles/globals.scss";

import { NavBar } from "@/components/NavBar";

const inter = Roboto({ weight: ["300", "400", "500", "700", "900"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FCT App",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " App"}>
          <main>
            {children}
          </main>
          <NavBar />
      </body>
    </html>
  );
}
