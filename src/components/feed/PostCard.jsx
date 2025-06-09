import React from "react";

export default function PostCard({ user, job, content, time }) {
  return (
    <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-700">
          {user[0]}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{user}</div>
          <div className="text-xs text-gray-500">{job}</div>
        </div>
        <div className="ml-auto text-xs text-gray-400">{time}</div>
      </div>
      <div className="text-gray-800 mb-2">{content}</div>
      <button className="text-blue-600 hover:underline text-sm font-medium">Ứng tuyển</button>
    </div>
  );
}
