"use client";
import React from "react";
import { useSelector } from "react-redux";
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

const NavigationWithBadges = ({ currentUser }) => {
  const unreadNotifications = useSelector(
    (state) => state.notifications.unreadCount
  );
  const unreadMessages = useSelector(
    (state) => state.messages.unreadCount
  );

  const navItems = [
    { name: "Home", icon: <Home size={22} />, href: "/" },
    { name: "Explore", icon: <Search size={22} />, href: "/explore" },
    { 
      name: "Notifications", 
      icon: <Bell size={22} />, 
      href: "/notifications",
      badge: unreadNotifications
    },
    { 
      name: "Messages", 
      icon: <Mail size={22} />, 
      href: "/messages",
      badge: unreadMessages
    },
    { name: "Bookmarks", icon: <Bookmark size={22} />, href: "/bookmarks" },
    {
      name: "Profile",
      icon: <User size={22} />,
      href: currentUser.username ? `/profile/${currentUser.username}` : "#",
    },
    { name: "More", icon: <MoreHorizontal size={22} />, href: "#" },
  ];

  return (
    <ul className="flex-1 flex flex-col gap-2 sm:gap-3 overflow-y-auto">
      {navItems.map((item, idx) => (
        <li key={idx}>
          {item.href === "#" ? (
            <div className="flex items-center justify-center sm:justify-start gap-0 sm:gap-3 px-2 sm:px-3 py-2 rounded-xl hover:bg-[#47e669] cursor-pointer transition relative">
              {item.icon}
              <span className="hidden sm:inline text-base font-medium">
                {item.name}
              </span>
              {item.badge > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <Link href={item.href}>
              <div className="flex items-center justify-center sm:justify-start gap-0 sm:gap-3 px-2 sm:px-3 py-2 rounded-xl hover:bg-[#47e669] cursor-pointer transition relative">
                {item.icon}
                <span className="hidden sm:inline text-base font-medium">
                  {item.name}
                </span>
                {item.badge > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  </div>
                )}
              </div>
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
};