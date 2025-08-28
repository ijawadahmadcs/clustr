"use client";
import React from "react";
import SignUpPrompt from "../SignUpPrompt/SignUpPrompt";
import UserProfile from "../UserProfile/UserProfile";
import Link from "next/link";

import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  User,
  MoreHorizontal,
} from "lucide-react";

const navItems = [
  { name: "Home", icon: <Home size={22} />, href: "/" },
  { name: "Explore", icon: <Search size={22} />, href: "/explore" },
  { name: "Notifications", icon: <Bell size={22} />, href: "/notifications" },
  { name: "Inbox", icon: <Mail size={22} />, href: "/inbox" },
  { name: "Bookmarks", icon: <Bookmark size={22} />, href: "/bookmarks" },
  { name: "Profile", icon: <User size={22} />, href: "/profile" },
  { name: "More", icon: <MoreHorizontal size={22} />, href: "/more" },
];

const SideBar = () => {
  return (
    <nav
      className="flex flex-col justify-between h-screen 
                w-14 sm:w-56 p-2 sm:p-4 
                border-r border-gray-200 sticky top-0"
    >
      <div className="text-xl sm:text-3xl font-bold text-[#2ad14e] mb-6 text-center sm:text-left">
        C<span className="hidden sm:inline">lustr</span>
      </div>

      <ul className="flex-1 flex flex-col gap-2 sm:gap-3">
        {navItems.map((item, idx) => (
          <li
            key={idx}
            className="flex items-center justify-center sm:justify-start gap-0 sm:gap-3 
                   px-2 sm:px-3 py-2 rounded-xl 
                   hover:bg-[#47e669] cursor-pointer transition"
          >
            <Link href={item.href} className="flex items-center gap-3 w-full">
              {item.icon}
              <span className="hidden sm:inline text-base font-medium">
                {item.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <SignUpPrompt />
      <UserProfile />
    </nav>
  );
};

export default SideBar;
