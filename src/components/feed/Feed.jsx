import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Heart,
  MessageCircle,
  Share2,
  Trash2,
  Pencil,
  MoreHorizontal,
  Briefcase,
  MapPin,
  DollarSign,
  FileText,
} from "lucide-react";
import PostImageGrid from "../common/createPost/PostImageGrid";
import UpdatePostModal from "../popUpUpdatePost/UpdatePostModal";

export default function Feed() {
  const [feed, setFeed] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDropdownId, setShowDropdownId] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [canExpandPosts, setCanExpandPosts] = useState({});
  const contentRefs = useRef({});

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      const updated = {};
      feed.forEach((item) => {
        const el = contentRefs.current[item._id];
        if (el) {
          updated[item._id] = el.scrollHeight > 96;
        }
      });
      setCanExpandPosts(updated);
    });

    Object.values(contentRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [feed]);

  const fetchData = async () => {
    try {
      const [postRes, jobRes] = await Promise.all([
        axios.get("http://localhost:3000/api/posts/GetAllPosts"),
        axios.get("http://localhost:3000/api/jobposts"),
      ]);

      const formattedPosts = Array.isArray(postRes.data)
        ? postRes.data.map((item) => ({
            ...item,
            type: "post",
            createdAt: item.created_at,
          }))
        : [];

      const formattedJobs = Array.isArray(jobRes.data)
        ? jobRes.data.map((item) => ({
            ...item,
            type: "jobpost",
            createdAt: item.createdAt,
          }))
        : [];

      const combined = [...formattedPosts, ...formattedJobs].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setFeed(combined);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu feed:", error);
    }
  };

  const handleDeletePost = async (id) => {
    const confirm = window.confirm("Bạn có chắc chắn muốn xoá bài viết này?");
    if (!confirm) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/posts/DeletePostById/${id}`
      );
      setFeed((prev) => prev.filter((item) => item._id !== id));
      alert("✅ Đã xoá bài viết");
    } catch (error) {
      console.error("❌ Lỗi khi xoá bài viết:", error);
      alert("❌ Xoá bài thất bại");
    }
  };

  const handleUpdateSuccess = (updatedPost) => {
    setFeed((prev) =>
      prev.map((item) => (item._id === updatedPost._id ? updatedPost : item))
    );
    setSelectedPost(null);
  };

  const toggleExpand = (id) => {
    setExpandedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
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
      {feed.map((item) => {
        const isExpanded = expandedPosts[item._id];

        return (
          <div
            key={item._id}
            className="bg-white border border-gray-300 rounded-lg p-5 shadow-sm hover:shadow-md transition-all space-y-3 relative"
          >
            {item.type === "post" && (
              <div className="absolute top-4 right-4">
                <button
                  className="text-gray-600 hover:text-black"
                  onClick={() =>
                    setShowDropdownId((prev) =>
                      prev === item._id ? null : item._id
                    )
                  }
                >
                  <MoreHorizontal size={20} />
                </button>
                {showDropdownId === item._id && (
                  <div className="absolute right-0 mt-1 w-28 bg-white border rounded shadow z-10">
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm"
                      onClick={() => {
                        setSelectedPost(item);
                        setShowDropdownId(null);
                      }}
                    >
                      <Pencil size={14} /> Sửa
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2 text-sm text-red-600"
                      onClick={() => {
                        handleDeletePost(item._id);
                        setShowDropdownId(null);
                      }}
                    >
                      <Trash2 size={14} /> Xoá
                    </button>
                  </div>
                )}
              </div>
            )}

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
            </div>

            <div
              ref={(el) => (contentRefs.current[item._id] = el)}
              className={`text-gray-800 text-sm whitespace-pre-line transition-all duration-300 ${
                !isExpanded && canExpandPosts[item._id]
                  ? "max-h-[96px] overflow-hidden"
                  : ""
              }`}
            >
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

            {canExpandPosts[item._id] && (
              <button
                className="text-xs text-blue-600 hover:underline"
                onClick={() => toggleExpand(item._id)}
              >
                {isExpanded ? "Thu gọn" : "Xem thêm"}
              </button>
            )}

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

            {item.images && <PostImageGrid images={item.images} />}
            {renderAttachments(item.attachments)}

            {item.type === "jobpost" && item.salary_range?.min && (
              <div className="text-sm text-gray-600 flex items-center gap-1">
                <DollarSign size={16} />
                {item.salary_range.min.toLocaleString()} –{" "}
                {item.salary_range.max.toLocaleString()} USD
              </div>
            )}

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
        );
      })}

      {selectedPost && (
        <UpdatePostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onUpdate={handleUpdateSuccess}
        />
      )}
    </div>
  );
}
