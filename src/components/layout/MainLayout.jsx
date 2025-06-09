import React from "react";

export default function MainLayout({ sidebar, children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:block w-72 bg-white border-r border-gray-200 p-6">
        {sidebar}
      </aside>
      {/* Main Content */}
      <main className="flex-1 px-4 py-8 max-w-4xl mx-auto">
        {children}
      </main>
    </div>
  );
}
