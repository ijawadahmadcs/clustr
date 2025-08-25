"use client";

import SignUpPrompt from "../SignUpPrompt/SignUpPrompt";

export default function Widgets() {
  return (
    <aside className="hidden lg:block w-80 p-4 space-y-4">
      
      {/* Search Bar */}
      <div className="sticky top-0 bg-gray-100 dark:bg-gray-900 z-10 pb-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#2ad14e]"
          />
          <svg
            className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
        </div>
      </div>

      {/* Trending Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4">
        <h2 className="text-lg font-bold mb-2">Trending</h2>
        <ul className="space-y-2">
          <li className="cursor-pointer hover:text-[#2ad14e]">
            #NextJS <span className="text-sm text-gray-500">12.3K</span>
          </li>
          <li className="cursor-pointer hover:text-[#2ad14e]">
            #AI <span className="text-sm text-gray-500">9.1K</span>
          </li>
          <li className="cursor-pointer hover:text-[#2ad14e]">
            #OpenSource <span className="text-sm text-gray-500">6.7K</span>
          </li>
          <li className="cursor-pointer hover:text-[#2ad14e]">
            #TechNews <span className="text-sm text-gray-500">4.2K</span>
          </li>
        </ul>
        <p className="text-sm text-[#2ad14e] mt-3 cursor-pointer hover:underline">
          Show more
        </p>
      </div>

      {/* Suggested Accounts */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4">
        <h2 className="text-lg font-bold mb-2">Who to follow</h2>

        <div className="flex items-center justify-between mb-3 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
          <div className="flex items-center gap-2">
            <img
              src="https://i.pravatar.cc/40?u=1"
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">John Doe</p>
              <p className="text-xs text-gray-500">@johndoe</p>
            </div>
          </div>
          <button className="px-3 py-1 text-sm rounded-full bg-[#2ad14e] text-white hover:bg-green-600">
            Follow
          </button>
        </div>

        <div className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg cursor-pointer">
          <div className="flex items-center gap-2">
            <img
              src="https://i.pravatar.cc/40?u=2"
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">Alice Smith</p>
              <p className="text-xs text-gray-500">@alices</p>
            </div>
          </div>
          <button className="px-3 py-1 text-sm rounded-full bg-[#2ad14e] text-white hover:bg-green-600">
            Follow
          </button>
        </div>

        <p className="text-sm text-[#2ad14e] mt-3 cursor-pointer hover:underline">
          Show more
        </p>
      </div>

      {/* Poll Section */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-md p-4">
        <h2 className="text-lg font-bold mb-2">Quick Poll</h2>
        <p className="text-sm mb-3">Which JS framework do you prefer?</p>
        <div className="space-y-2">
          <button className="w-full px-3 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800">
            Next.js
          </button>
          <button className="w-full px-3 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800">
            React
          </button>
          <button className="w-full px-3 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800">
            Vue
          </button>
        </div>
      </div>
      <SignUpPrompt/>

    </aside>
  );
}
