import React, { useEffect, useState } from "react";
import axios from "axios";
import { Heart, MessageCircle, Share2 } from "lucide-react";

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

  return (
    <div className="flex flex-col gap-8 p-4">
      {feed.map((item) => (
        <div
          key={item._id}
          className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4 hover:shadow-xl transition-all"
        >
          {/* Header */}
          <div className="flex items-center gap-4">
            <img
              src={
                item.user_id?.avatar ||
                "https://randomuser.me/api/portraits/lego/1.jpg"
              }
              alt="avatar"
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="font-bold text-lg">
                {item.user_id?.name || "Ẩn danh"}
              </div>
              <div className="text-gray-400 text-sm">
                {new Date(item.createdAt).toLocaleString("vi-VN")}
              </div>
            </div>
          </div>

          {/* Content */}
          {item.type === "post" ? (
            <>
              <div className="text-gray-800 text-base">{item.content}</div>
              {item.images?.length > 0 && (
                <img
                  src={item.images[0]}
                  alt="image"
                  className="rounded-xl w-full object-cover max-h-60"
                />
              )}
              {item.attachments?.length > 0 && (
                <div className="mt-2 space-y-1">
                  {item.attachments.map((att) => (
                    <a
                      key={att._id}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 underline"
                    >
                      📎 {att.filename}
                    </a>
                  ))}
                </div>
              )}
              <div className="flex gap-8 mt-2 text-gray-500">
                <button className="flex items-center gap-2 hover:text-red-500 transition">
                  <Heart size={20} /> {item.likeCount} Thích
                </button>
                <button className="flex items-center gap-2 hover:text-blue-500 transition">
                  <MessageCircle size={20} /> {item.commentCount} Bình luận
                </button>
                <button className="flex items-center gap-2 hover:text-green-500 transition">
                  <Share2 size={20} /> Chia sẻ
                </button>
              </div>
              {item.comments?.length > 0 && (
                <div className="mt-3 space-y-3">
                  {item.comments.map((comment) => (
                    <div key={comment._id} className="flex gap-3 items-start">
                      <img
                        src={
                          comment.userId?.avatar ||
                          "https://randomuser.me/api/portraits/lego/2.jpg"
                        }
                        alt="avatar"
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="bg-gray-100 rounded-xl px-4 py-2 w-full">
                        <div className="text-sm font-semibold text-gray-700">
                          {comment.userId?.name || "Ẩn danh"}
                        </div>
                        <div className="text-gray-700 text-sm">
                          {comment.content}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(comment.createdAt).toLocaleString("vi-VN")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              {/* JOB POST */}
              <div className="text-gray-900 font-bold text-lg">
                {item.title}
              </div>
              <div className="text-gray-600 text-sm italic">
                {item.company_name} – {item.location}
              </div>
              <div className="text-gray-700 text-base mt-1">
                {item.description}
              </div>
              {item.images?.length > 0 && (
                <img
                  src={item.images[0]}
                  alt="job"
                  className="rounded-xl w-full object-cover max-h-60"
                />
              )}
              {item.attachments?.length > 0 && (
                <div className="mt-2 space-y-1">
                  {item.attachments.map((att, i) => (
                    <a
                      key={i}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 underline"
                    >
                      📎 {att.filename}
                    </a>
                  ))}
                </div>
              )}
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
