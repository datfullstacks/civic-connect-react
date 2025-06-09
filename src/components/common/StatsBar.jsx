import React from "react";
import { TrendingUp, Users, Briefcase, Calendar } from "lucide-react";

const stats = [
  { icon: <TrendingUp className="h-6 w-6 text-blue-600" />, label: "Việc làm", value: 234 },
  { icon: <Users className="h-6 w-6 text-green-600" />, label: "Thành viên", value: 5678 },
  { icon: <Briefcase className="h-6 w-6 text-purple-600" />, label: "Công ty", value: 123 },
  { icon: <Calendar className="h-6 w-6 text-orange-600" />, label: "Sự kiện", value: 89 },
];

export default function StatsBar() {
  return (
    <div className="max-w-5xl mx-auto -mt-14 mb-12 grid grid-cols-2 md:grid-cols-4 gap-8">
      <div className="bg-white rounded-2xl shadow p-8 text-center hover:shadow-2xl hover:scale-105 transition-all cursor-pointer">
        <TrendingUp className="mx-auto mb-2 text-blue-500" size={36} />
        <div className="text-3xl font-extrabold text-blue-600">1,234</div>
        <div className="text-gray-500 mt-2 font-medium">Chương trình</div>
      </div>
      <div className="bg-white rounded-2xl shadow p-8 text-center hover:shadow-2xl hover:scale-105 transition-all cursor-pointer">
        <Users className="mx-auto mb-2 text-green-500" size={36} />
        <div className="text-3xl font-extrabold text-green-600">5,678</div>
        <div className="text-gray-500 mt-2 font-medium">Thành viên</div>
      </div>
      <div className="bg-white rounded-2xl shadow p-8 text-center hover:shadow-2xl hover:scale-105 transition-all cursor-pointer">
        <Briefcase className="mx-auto mb-2 text-purple-500" size={36} />
        <div className="text-3xl font-extrabold text-purple-600">234</div>
        <div className="text-gray-500 mt-2 font-medium">Việc làm</div>
      </div>
      <div className="bg-white rounded-2xl shadow p-8 text-center hover:shadow-2xl hover:scale-105 transition-all cursor-pointer">
        <Calendar className="mx-auto mb-2 text-orange-500" size={36} />
        <div className="text-3xl font-extrabold text-orange-600">89</div>
        <div className="text-gray-500 mt-2 font-medium">Sự kiện</div>
      </div>
    </div>
  );
}
