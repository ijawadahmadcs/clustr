"use client";
import React from "react";
import SignUpPrompt from "../SignUpPrompt/SignUpPrompt";

import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  User,
  MoreHorizontal,
} from "lucide-react";
import Signup from "../buttonsSignup/Signup";

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
      <nav
        className="flex flex-col justify-between h-screen 
                w-14 sm:w-56 p-2 sm:p-4 
                border-r border-gray-200 sticky top-0"
      >
        {/* Logo */}
        <div className="text-xl sm:text-3xl font-bold text-[#2ad14e] mb-6 text-center sm:text-left">
          C<span className="hidden sm:inline">lustr</span>
        </div>

        {/* Nav Items */}
        <ul className="flex-1 flex flex-col gap-2 sm:gap-3">
          {navItems.map((item, idx) => (
            <li
              key={idx}
              className="flex items-center justify-center sm:justify-start gap-0 sm:gap-3 
                   px-2 sm:px-3 py-2 rounded-xl 
                   hover:bg-[#47e669] cursor-pointer transition"
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
          <button className="sm:hidden mt-4 rounded-full bg-[#47e669] w-10 h-10 flex items-center justify-center text-white font-bold shadow-md hover:bg-[#2ad14e] transition">
            +
          </button>
        </ul>

        <SignUpPrompt />
        <Signup />
      </nav>
    </>
  );
};

export default SideBar;
