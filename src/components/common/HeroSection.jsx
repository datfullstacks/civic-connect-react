import React from "react";
import { Button } from "../ui/button";
import { Search, Plus, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-purple-600 py-20 text-white shadow-2xl rounded-b-3xl mb-8 relative overflow-hidden">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 opacity-20 pointer-events-none">
        <Sparkles size={220} />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-6xl font-extrabold tracking-tight drop-shadow-2xl">Civic Connect</h1>
        <p className="text-2xl opacity-90 font-medium">Kết nối cộng đồng, tìm kiếm cơ hội, tạo nên sự khác biệt</p>
        <div className="flex justify-center gap-6 mt-8">
          <button className="bg-white text-blue-600 font-bold px-8 py-4 rounded-full shadow-lg hover:bg-blue-100 hover:scale-105 transition-all text-lg">Khám phá cơ hội</button>
          <button className="bg-transparent border-2 border-white px-8 py-4 rounded-full hover:bg-white hover:text-blue-600 hover:scale-105 transition-all text-lg font-bold">Tạo bài viết</button>
        </div>
      </div>
    </section>
  );
}
