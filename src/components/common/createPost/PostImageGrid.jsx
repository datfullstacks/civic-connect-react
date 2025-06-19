import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function PostImageGrid({ images = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  const open = (index) => {
    setCurrent(index);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);
  const next = () => setCurrent((prev) => (prev + 1) % images.length);
  const prev = () =>
    setCurrent((prev) => (prev - 1 + images.length) % images.length);

  const getGridStyle = () => {
    if (images.length === 1) return "grid-cols-1";
    if (images.length === 2) return "grid-cols-2";
    if (images.length === 3) return "grid-cols-3";
    return "grid-cols-2"; // for 4 or more
  };

  const displayedImages = images.length > 5 ? images.slice(0, 4) : images;

  return (
    <>
      <div className={`grid ${getGridStyle()} gap-1 mt-2`}>
        {displayedImages.map((src, index) => (
          <div
            key={index}
            className="relative cursor-pointer"
            onClick={() => open(index)}
          >
            <img
              src={src}
              alt={`img-${index}`}
              className={`w-full rounded-md ${
                images.length === 1
                  ? "object-contain max-h-[500px]"
                  : "h-60 object-cover"
              }`}
            />
            {index === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center text-2xl font-bold rounded-md">
                +{images.length - 4}
              </div>
            )}
          </div>
        ))}
      </div>

      <Dialog open={isOpen} onClose={close} className="fixed inset-0 z-50">
        <div className="flex items-center justify-center h-full bg-black bg-opacity-90 relative">
          <button onClick={close} className="absolute top-4 right-6 text-white">
            <X size={32} />
          </button>
          <button onClick={prev} className="absolute left-6 text-white">
            <ChevronLeft size={32} />
          </button>
          <img
            src={images[current]}
            className="max-h-[90vh] max-w-[95vw] rounded-xl object-contain"
          />
          <button onClick={next} className="absolute right-6 text-white">
            <ChevronRight size={32} />
          </button>
        </div>
      </Dialog>
    </>
  );
}
