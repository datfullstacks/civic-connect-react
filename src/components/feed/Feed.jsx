import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Heart,
  MessageCircle,
  Share2,
  Trash2,
  Briefcase,
  MapPin,
  DollarSign,
  FileText,
} from "lucide-react";
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

  const renderAttachments = (attachments) =>
    attachments?.length > 0 && (
      <div className="mt-2 space-y-1">
        {attachments.map((att, i) => (
          <a
            key={att._id || i}
            href={att.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-blue-600 underline text-sm flex items-center gap-1"
          >
            <FileText size={16} /> {att.filename}
          </a>
        ))}
      </div>
    );

  if (!feed.length) {
    return (
      <div className="text-center text-gray-500 py-8">Đang tải dữ liệu...</div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {feed.map((item) => (
        <div
          key={item._id}
          className="bg-white border border-gray-300 rounded-lg p-5 shadow-sm hover:shadow-md transition-all space-y-3"
        >
          {/* Header */}
          <div className="flex items-center gap-4">
            <img
              src={
                item.user_id?.avatar ||
                "https://randomuser.me/api/portraits/lego/1.jpg"
              }
              alt="avatar"
              className="w-11 h-11 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="font-semibold text-gray-800">
                {item.user_id?.name || "Ẩn danh"}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(item.createdAt).toLocaleString("vi-VN")}
              </div>
            </div>
            {item.type === "post" && (
              <button
                onClick={() => handleDeletePost(item._id)}
                className="text-red-500 hover:text-red-700"
                title="Xoá bài viết"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>

          {/* Nội dung */}
          <div className="text-gray-800 whitespace-pre-line text-sm">
            {item.type === "jobpost" ? (
              <>
                <div className="text-lg font-bold text-blue-700">
                  {item.title}
                </div>
                <div className="text-sm text-gray-700 flex items-center gap-1">
                  <Briefcase size={14} /> {item.company_name}
                </div>
                <div className="text-sm text-gray-700 flex items-center gap-1">
                  <MapPin size={14} /> {item.location}
                </div>
                <div className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                  {item.description}
                </div>
              </>
            ) : (
              item.content
            )}
          </div>

          {/* Tags */}
          {item.tags?.length > 0 && (
            <div className="flex gap-2 flex-wrap">
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

          {/* Images */}
          {item.images && <PostImageGrid images={item.images} />}
          {renderAttachments(item.attachments)}

          {/* Lương */}
          {item.type === "jobpost" && item.salary_range?.min && (
            <div className="text-sm text-gray-600 flex items-center gap-1">
              <DollarSign size={16} />
              {item.salary_range.min.toLocaleString()} –{" "}
              {item.salary_range.max.toLocaleString()} USD
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-6 text-gray-500 pt-2 border-t border-gray-200 mt-3 pt-3 text-sm">
            <button className="flex items-center gap-2 hover:text-red-500 transition">
              <Heart size={18} /> {item.likeCount || 0} Thích
            </button>
            <button className="flex items-center gap-2 hover:text-blue-500 transition">
              <MessageCircle size={18} /> {item.commentCount || 0} Bình luận
            </button>
            <button className="flex items-center gap-2 hover:text-green-500 transition">
              <Share2 size={18} /> Chia sẻ
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
