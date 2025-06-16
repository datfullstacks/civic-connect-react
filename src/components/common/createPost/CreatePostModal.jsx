import React, { useState } from "react";

export default function CreatePostModal({ isOpen, onClose, onSubmit }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit({ content, images: image ? [image] : [] });
    setContent("");
    setImage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Tạo bài viết mới</h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Bạn đang nghĩ gì?"
          className="w-full border rounded-lg p-3 resize-none text-sm"
          rows={4}
        />
        <input
          type="text"
          placeholder="Link hình ảnh (nếu có)"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full border rounded-lg p-2 text-sm"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Huỷ
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Đăng bài
          </button>
        </div>
      </div>
    </div>
  );
}
