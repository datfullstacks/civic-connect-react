import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UpdatePostModal({ post, onClose, onUpdate }) {
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    if (post) {
      setContent(post.content || "");
      setTags((post.tags || []).join(", "));
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = {
        content,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      await axios.put(
        `http://localhost:3000/api/posts/UpdatePostById/${post._id}`,
        updatedData
      );
      onUpdate?.(); // gọi callback nếu có
      onClose?.();
      alert("✅ Cập nhật bài viết thành công");
    } catch (err) {
      console.error("❌ Lỗi cập nhật:", err);
      alert("❌ Cập nhật thất bại");
    }
  };

  return (
    <Dialog
      open={!!post} // đảm bảo là boolean
      onClose={onClose}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="bg-white rounded-lg shadow-xl z-50 max-w-md w-full p-6 relative">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Chỉnh sửa bài viết
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              rows={4}
              className="w-full border rounded p-2"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nội dung bài viết"
              required
            />
            <input
              className="w-full border rounded p-2"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Tags (cách nhau bởi dấu phẩy)"
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
              >
                Huỷ
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
}
