import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Fosfenos Media",
  description: "Familia creativa con el profundo deseo de contar historias para el público infantil",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} dark:bg-black`}>
        {children}
      </body>
    </html>
  );
}