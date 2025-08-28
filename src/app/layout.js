import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/store/ReduxProvider";
import SideBar from "@/components/SideBar/SideBar";
import Widgets from "@/components/Widgets/Widgets";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Clustr",
  description: "Cluster of conversations",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {" "}
        <ReduxProvider>
          <div className="text-black bg-gray-100 min-h-screen max-w-[1400px] mx-auto flex">
            <SideBar />
            <main className="flex-1 border-x border-gray-200">
              <div>{children}</div>
            </main>
            <div className="hidden lg:block w-[350px]">
              <Widgets />
            </div>
          </div>
        </ReduxProvider>
      </body>
    </html>
  );
}
