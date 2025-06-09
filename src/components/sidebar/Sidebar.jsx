import React from "react";
import { User, Home, Search, Bell, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-8 min-h-[350px]">
      <div className="flex flex-col items-center gap-2">
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="avatar" className="w-20 h-20 rounded-full shadow" />
        <div className="font-bold text-lg mt-2">Nguyễn Văn A</div>
        <div className="text-gray-400 text-sm">Công dân</div>
      </div>
      <nav className="w-full mt-6">
        <ul className="flex flex-col gap-4">
          <li className="flex items-center gap-3 text-gray-700 hover:text-blue-600 cursor-pointer font-medium transition"><Home size={20}/> Trang chủ</li>
          <li className="flex items-center gap-3 text-gray-700 hover:text-blue-600 cursor-pointer font-medium transition"><Search size={20}/> Tìm kiếm</li>
          <li className="flex items-center gap-3 text-gray-700 hover:text-blue-600 cursor-pointer font-medium transition"><Bell size={20}/> Thông báo</li>
          <li className="flex items-center gap-3 text-gray-700 hover:text-blue-600 cursor-pointer font-medium transition"><User size={20}/> Hồ sơ</li>
          <li className="flex items-center gap-3 text-gray-700 hover:text-blue-600 cursor-pointer font-medium transition"><Settings size={20}/> Cài đặt</li>
        </ul>
      </nav>
    </aside>
  );
}
