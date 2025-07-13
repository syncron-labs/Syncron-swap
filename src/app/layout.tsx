import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { appName } from "../utils/corefunctions";
import DefaultLayout from "../components/layouts/defaultLayout";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: `${appName() || "Uni Defi"} - Trade Crypto on top of defi`,
  description: "Trade Crypto on top of defi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} `}>
        <DefaultLayout>{children}</DefaultLayout>
      </body>
    </html>
  );
}
