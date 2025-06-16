import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart, MessageCircle, Share2, Trash2 } from "lucide-react";
import PostImageGrid from "../common/createPost/PostImageGrid";

export default function Feed() {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postRes, jobRes] = await Promise.all([
          axios.get("http://localhost:3000/api/posts/GetAllPosts"),
          axios.get("http://localhost:3000/api/jobposts"),
        ]);

        const formattedPosts = postRes.data.map((item) => ({
          ...item,
          type: "post",
          createdAt: item.created_at,
        }));

        const formattedJobs = jobRes.data.map((item) => ({
          ...item,
          type: "jobpost",
          createdAt: item.createdAt,
        }));

        const combined = [...formattedPosts, ...formattedJobs].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setFeed(combined);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu feed:", error);
      }
    };

    fetchData();
  }, []);

  const handleDeletePost = async (id) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xoá bài viết này?");
    if (!confirm) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/posts/DeletePostById/${id}`
      );
      setFeed((prev) => prev.filter((item) => item._id !== id));
      alert("\u2705 Đã xoá bài viết");
    } catch (error) {
      console.error("\u274c Lỗi khi xoá bài viết:", error);
      alert("\u274c Xoá bài thất bại");
    }
  };

  if (!feed.length) {
    return (
      <div className="text-center text-gray-500 py-8">
        \u0110ang tải dữ liệu...
      </div>
    );
  }

  const renderAttachments = (attachments) =>
    attachments?.length > 0 && (
      <div className="mt-2 space-y-1">
        {attachments.map((att, i) => (
          <a
            key={att._id || i}
            href={att.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-600 underline"
          >
            📎 {att.filename}
          </a>
        ))}
      </div>
    );

  return (
    <div className="flex flex-col gap-8 p-4">
      {feed.map((item) => (
        <div
          key={item._id}
          className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4 hover:shadow-xl transition-all"
        >
          <div className="flex items-center gap-4">
            <img
              src={
                item.user_id?.avatar ||
                "https://randomuser.me/api/portraits/lego/1.jpg"
              }
              alt="avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="font-bold text-lg">
                {item.user_id?.name || "\u1ea8n danh"}
              </div>
              <div className="text-gray-400 text-sm">
                {new Date(item.createdAt).toLocaleString("vi-VN")}
              </div>
            </div>
            {item.type === "post" && (
              <button
                onClick={() => handleDeletePost(item._id)}
                className="text-red-500 hover:text-red-700 transition"
                title="Xoá bài viết"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>

          {item.type === "post" ? (
            <>
              <div className="text-gray-800 text-base whitespace-pre-line">
                {item.content}
              </div>
              {item.tags?.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-1">
                  {item.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <PostImageGrid images={item.images} />
              {renderAttachments(item.attachments)}
              <div className="flex gap-8 mt-2 text-gray-500">
                <button className="flex items-center gap-2 hover:text-red-500 transition">
                  <Heart size={20} /> {item.likeCount || 0} Thích
                </button>
                <button className="flex items-center gap-2 hover:text-blue-500 transition">
                  <MessageCircle size={20} /> {item.commentCount || 0} Bình luận
                </button>
                <button className="flex items-center gap-2 hover:text-green-500 transition">
                  <Share2 size={20} /> Chia sẻ
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="text-gray-900 font-bold text-lg">
                {item.title}
              </div>
              <div className="text-gray-600 text-sm italic">
                {item.company_name} – {item.location}
              </div>
              <div className="text-gray-700 text-base mt-1 whitespace-pre-line">
                {item.description}
              </div>
              <PostImageGrid images={item.images} />
              {renderAttachments(item.attachments)}
              <div className="text-sm text-gray-500 mt-2">
                💰 {item.salary_range?.min?.toLocaleString()} –{" "}
                {item.salary_range?.max?.toLocaleString()} USD
              </div>
              <div className="flex gap-8 mt-2 text-gray-500">
                <button className="flex items-center gap-2 hover:text-red-500 transition">
                  <Heart size={20} /> Quan tâm
                </button>
                <button className="flex items-center gap-2 hover:text-green-500 transition">
                  <Share2 size={20} /> Chia sẻ
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
