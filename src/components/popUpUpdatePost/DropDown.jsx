// src/components/PostDropdownMenu.jsx
import { Menu } from "@headlessui/react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

export default function PostDropdownMenu({ onEdit, onDelete }) {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="text-gray-600 hover:text-black p-1">
        <MoreVertical size={20} />
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-md shadow-lg z-50">
        <div className="p-1">
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onEdit}
                className={`${
                  active ? "bg-gray-100" : ""
                } flex items-center w-full px-3 py-2 text-sm text-gray-800`}
              >
                <Pencil size={16} className="mr-2" /> Chỉnh sửa
              </button>
            )}
          </Menu.Item>

          <Menu.Item>
            {({ active }) => (
              <button
                onClick={onDelete}
                className={`${
                  active ? "bg-red-100 text-red-700" : "text-red-600"
                } flex items-center w-full px-3 py-2 text-sm`}
              >
                <Trash2 size={16} className="mr-2" /> Xoá bài viết
              </button>
            )}
          </Menu.Item>
        </div>
      </Menu.Items>
    </Menu>
  );
}
