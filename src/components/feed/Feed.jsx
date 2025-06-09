import React from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";

// Dummy data
const posts = [
  {
    id: 1,
    user: {
      name: "Nguyễn Văn B",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    time: "2 giờ trước",
    content: "Cùng nhau xây dựng cộng đồng văn minh, hiện đại!",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    user: {
      name: "Trần Thị C",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    time: "5 giờ trước",
    content: "Sự kiện hội thảo việc làm sẽ diễn ra vào tuần tới, mọi người nhớ tham gia nhé!",
    image: null,
  },
];

export default function Feed() {
  return (
    <div className="flex flex-col gap-8">
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4 hover:shadow-xl transition-all">
          <div className="flex items-center gap-4">
            <img src={post.user.avatar} alt="avatar" className="w-12 h-12 rounded-full" />
            <div>
              <div className="font-bold text-lg">{post.user.name}</div>
              <div className="text-gray-400 text-sm">{post.time}</div>
            </div>
          </div>
          <div className="text-gray-700 text-base font-medium">{post.content}</div>
          {post.image && (
            <img src={post.image} alt="post" className="rounded-xl w-full object-cover max-h-60" />
          )}
          <div className="flex gap-8 mt-2 text-gray-500">
            <button className="flex items-center gap-2 hover:text-red-500 transition"><Heart size={20}/> Thích</button>
            <button className="flex items-center gap-2 hover:text-blue-500 transition"><MessageCircle size={20}/> Bình luận</button>
            <button className="flex items-center gap-2 hover:text-green-500 transition"><Share2 size={20}/> Chia sẻ</button>
          </div>
        </div>
      ))}
    </div>
  );
}
