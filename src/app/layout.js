import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/store/ReduxProvider";
import SideBar from "@/components/SideBar/SideBar";
import Widgets from "@/components/Widgets/Widgets";
import ProfileProvider from "@/components/providers/ProfileProvider";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <ProfileProvider>
            <div
              className="
                text-black bg-gray-100 min-h-screen max-w-[1400px] mx-auto
                grid grid-cols-12
              "
            >
              {/* Sidebar */}
              <aside className="col-span-2 lg:col-span-2">
                <SideBar />
              </aside>

              {/* Main Content */}
              <main className="col-span-10 lg:col-span-7">{children}</main>

              {/* Widgets / Right Sidebar */}
              <aside className="hidden lg:block col-span-3 p-2 bg-white">
                <Widgets />
              </aside>
            </div>
          </ProfileProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
