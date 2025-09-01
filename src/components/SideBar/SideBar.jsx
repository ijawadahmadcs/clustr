"use client";
import React from "react";
import SignUpPrompt from "../SignUpPrompt/SignUpPrompt";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  User,
  MoreHorizontal,
} from "lucide-react";
import LogoutIcon from "../LogoutIcon/LogoutIcon";

const SideBar = () => {
  const currentUser = useSelector((state) => state.user);

  const navItems = [
    { name: "Home", icon: <Home size={22} />, href: "/" },
    { name: "Explore", icon: <Search size={22} />, href: "/explore" },
    { name: "Notifications", icon: <Bell size={22} />, href: "/notifications" },
    { name: "Messages", icon: <Mail size={22} />, href: "/messages" },
    { name: "Bookmarks", icon: <Bookmark size={22} />, href: "/bookmarks" },
    {
      name: "Profile",
      icon: <User size={22} />,
      href: currentUser.username ? `/profile/${currentUser.username}` : "#",
    },
    { name: "More", icon: <MoreHorizontal size={22} />, href: "#" },
  ];

  return (
    <aside
      className="
        fixed   /* <-- Makes sidebar stay visible on scroll */
        top-0 left-0
        flex flex-col justify-between
        w-16 sm:w-20 md:w-56
        h-screen
        border-r border-gray-200
        bg-white
        p-2 sm:p-4
        z-50
      "
    >
      {/* Logo */}
      <Link href="/">
        <div className="text-xl sm:text-3xl font-bold text-[#2ad14e] mb-6 text-center sm:text-left cursor-pointer hover:opacity-80 transition">
          C<span className="hidden sm:inline">lustr</span>
        </div>
      </Link>

      {/* Navigation Items */}
      <ul className="flex-1 flex flex-col gap-2 sm:gap-3 overflow-y-auto">
        {navItems.map((item, idx) => (
          <li key={idx}>
            {item.href === "#" ? (
              <div
                className="flex items-center justify-center sm:justify-start gap-0 sm:gap-3 
                  px-2 sm:px-3 py-2 rounded-xl 
                  hover:bg-[#47e669] cursor-pointer transition"
              >
                {item.icon}
                <span className="hidden sm:inline text-base font-medium">
                  {item.name}
                </span>
              </div>
            ) : (
              <Link href={item.href}>
                <div
                  className="flex items-center justify-center sm:justify-start gap-0 sm:gap-3 
                    px-2 sm:px-3 py-2 rounded-xl 
                    hover:bg-[#47e669] cursor-pointer transition"
                >
                  {item.icon}
                  <span className="hidden sm:inline text-base font-medium">
                    {item.name}
                  </span>
                </div>
              </Link>
            )}
          </li>
        ))}
      </ul>

      {/* Bottom Section */}
      <div className="flex flex-col gap-3 mt-4">
        <SignUpPrompt />
        <LogoutIcon />
      </div>
    </aside>
  );
};

export default SideBar;
