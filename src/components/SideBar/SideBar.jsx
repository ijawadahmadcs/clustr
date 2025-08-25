"use client";
import React from "react";
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
  { name: "Home", icon: <Home size={22} /> },
  { name: "Explore", icon: <Search size={22} /> },
  { name: "Notifications", icon: <Bell size={22} /> },
  { name: "Messages", icon: <Mail size={22} /> },
  { name: "Bookmarks", icon: <Bookmark size={22} /> },
  { name: "Profile", icon: <User size={22} /> },
  { name: "More", icon: <MoreHorizontal size={22} /> },
];

const SideBar = () => {
  return (
    <>
      {/* Sidebar always visible */}
      <nav className="flex flex-col justify-between h-screen w-20 sm:w-56 p-4 border-r border-gray-200 sticky top-0">
        {/* Logo */}
        <div className="text-2xl sm:text-3xl font-bold text-[#2ad14e] mb-6">
          C
          <span className="hidden sm:inline">lustr</span>
        </div>

        {/* Nav Items */}
        <ul className="flex-1 flex flex-col gap-3">
          {navItems.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center gap-3 px-3 py-2 rounded-2xl hover:bg-[#47e669] cursor-pointer transition"
            >
              {item.icon}
              <span className="hidden sm:inline text-base font-medium">
                {item.name}
              </span>
            </li>
          ))}

          {/* Post button - Desktop */}
          <button className="hidden sm:block mt-4 rounded-2xl bg-[#2ad14e] px-4 py-2 text-white font-semibold text-base text-center shadow-md hover:bg-[#26b342] transition">
            Post
          </button>

          {/* Post button - Mobile */}
          <button className="sm:hidden mt-4 rounded-full bg-[#47e669] w-12 h-12 flex items-center justify-center text-white font-bold shadow-md hover:bg-[#2ad14e] transition">
            +
          </button>
        </ul>

        {/* User Section */}
        <div className="mt-4 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm cursor-pointer hover:bg-gray-200 flex justify-center sm:justify-start">
          <span className="hidden sm:inline">Guest</span>
          <span className="sm:hidden"></span>
        </div>
      </nav>
    </>
  );
};

export default SideBar;
