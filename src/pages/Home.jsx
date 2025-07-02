import React from "react";
import Header from "../components/Header";
import HeroSection from "../components/common/HeroSection";
import StatsBar from "../components/common/StatsBar";
import Sidebar from "../components/sidebar/Sidebar";
import Feed from "../components/feed/Feed";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header />
      <div className="pt-16">
        <section className="w-full bg-gradient-to-r from-blue-500 to-purple-600 py-12 text-white text-center mb-0">
          <div className="max-w-7xl mx-auto px-8">
            <HeroSection />
          </div>
        </section>
        <section className="max-w-7xl mx-auto -mt-8 mb-12 px-8">
          <StatsBar />
        </section>
        <main className="container mx-auto max-w-7xl px-8 flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-1/4 w-full">
            <Sidebar />
          </aside>
          {/* Feed */}
          <section className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 min-h-[500px]">
              <Feed />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}