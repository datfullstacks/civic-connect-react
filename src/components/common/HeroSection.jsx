import React, { useState, useCallback } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { Sparkles, FileText, X } from "lucide-react";

function CreatePostModal({ isOpen, onClose, onSubmit }) {
  const [content, setContent] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [visibility, setVisibility] = useState("public");

  const onDrop = useCallback((acceptedFiles) => {
    const imageTypes = ["image/jpeg", "image/png", "image/webp"];
    const newImages = [];
    const newFiles = [];

    acceptedFiles.forEach((file) => {
      const preview = URL.createObjectURL(file);
      if (imageTypes.includes(file.type)) {
        newImages.push({ file, preview });
      } else {
        newFiles.push({ file, preview });
      }
    });

    setImageFiles((prev) => [...prev, ...newImages]);
    setAttachments((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = () => {
    if (!content.trim()) return alert("Nội dung không được để trống!");

    onSubmit({ content, imageFiles, attachments, tagInput, visibility });
    setContent("");
    setImageFiles([]);
    setAttachments([]);
    setTagInput("");
    setVisibility("public");
    onClose();
  };

  const removeFile = (type, index) => {
    if (type === "image") {
      const copy = [...imageFiles];
      copy.splice(index, 1);
      setImageFiles(copy);
    } else {
      const copy = [...attachments];
      copy.splice(index, 1);
      setAttachments(copy);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-xl shadow-lg space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Tạo bài viết mới</h2>

        <textarea
          placeholder="Bạn đang nghĩ gì?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full border rounded-md p-3 text-sm resize-none text-black"
        />

        <input
          type="text"
          placeholder="Tags (phân tách bằng dấu phẩy)"
          className="w-full border rounded-md p-2 text-sm text-black"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
        />

        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="w-full border rounded-md p-2 text-sm text-black"
        >
          <option value="public">Công khai</option>
          <option value="friends">Bạn bè</option>
          <option value="private">Chỉ mình tôi</option>
        </select>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
            isDragActive ? "bg-blue-50 border-blue-400" : "border-gray-300"
          }`}
        >
          <input {...getInputProps()} />
          <p className="text-sm text-gray-500">
            Kéo & thả hình ảnh hoặc file tại đây, hoặc click để chọn
          </p>
        </div>

        {imageFiles.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mt-2">
            {imageFiles.map((img, i) => (
              <div key={i} className="relative group">
                <img
                  src={img.preview}
                  alt="preview"
                  className="rounded-md object-cover h-24 w-full"
                />
                <button
                  onClick={() => removeFile("image", i)}
                  className="absolute top-0 right-0 bg-black bg-opacity-50 text-white p-1 rounded-bl-md hover:bg-opacity-70"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {attachments.length > 0 && (
          <ul className="space-y-2 text-sm mt-4">
            {attachments.map((att, i) => (
              <li
                key={i}
                className="flex items-center justify-between p-2 bg-gray-900 text-white rounded-md"
              >
                <div className="flex items-center gap-2">
                  <FileText size={18} className="text-blue-500" />
                  {att.file.name}
                </div>
                <button
                  onClick={() => removeFile("file", i)}
                  className="text-red-400 hover:text-red-600"
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Huỷ
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Đăng bài
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const [showModal, setShowModal] = useState(false);

  const handleCreatePost = async ({
    content,
    imageFiles,
    attachments,
    tagInput,
    visibility,
  }) => {
    try {
      const uploadedImages = await Promise.all(
        imageFiles.map(async (img) => {
          const formData = new FormData();
          formData.append("file", img.file);
          const res = await axios.post(
            "http://localhost:3000/api/upload",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          return res.data.url;
        })
      );

      const uploadedAttachments = await Promise.all(
        attachments.map(async (att) => {
          const formData = new FormData();
          formData.append("file", att.file);
          const res = await axios.post(
            "http://localhost:3000/api/upload",
            formData,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          return {
            filename: att.file.name,
            url: res.data.url,
            mimetype: att.file.type,
          };
        })
      );

      const postData = {
        content,
        images: uploadedImages,
        attachments: uploadedAttachments,
        tags: tagInput
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        visibility,
        user_id: "65f2d123a789b123e456f789",
      };

      await axios.post("http://localhost:3000/api/posts/CreatePost", postData);
      alert("🎉 Đăng bài thành công!");
    } catch (error) {
      console.error("Lỗi khi đăng bài:", error);
      alert("❌ Có lỗi xảy ra khi đăng bài!");
    }
  };
  
  return (
    <section className="bg-gradient-to-r from-blue-500 to-purple-600 py-20 text-white shadow-2xl rounded-b-3xl mb-8 relative overflow-hidden">
      <div className="absolute left-1/2 top-0 -translate-x-1/2 opacity-20 pointer-events-none">
        <Sparkles size={220} />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8">
        <h1 className="text-6xl font-extrabold tracking-tight drop-shadow-2xl">
          Civic Connect
        </h1>
        <p className="text-2xl opacity-90 font-medium">
          Kết nối cộng đồng, tìm kiếm cơ hội, tạo nên sự khác biệt
        </p>
        <div className="flex justify-center gap-6 mt-8">
          <button className="bg-white text-blue-600 font-bold px-8 py-4 rounded-full shadow-lg hover:bg-blue-100 hover:scale-105 transition-all text-lg">
            Khám phá cơ hội
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-transparent border-2 border-white px-8 py-4 rounded-full hover:bg-white hover:text-blue-600 hover:scale-105 transition-all text-lg font-bold"
          >
            Tạo bài viết
          </button>
        </div>
      </div>

      <CreatePostModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreatePost}
      />
    </section>
  );
}
