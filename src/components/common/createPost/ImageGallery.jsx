import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export default function ImageGallery({ images, initialIndex = 0, onClose }) {
  const [index, setIndex] = React.useState(initialIndex);

  const prev = () =>
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  const next = () => setIndex((prev) => (prev + 1) % images.length);

  return (
    <Transition appear show as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-80" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="relative max-w-4xl w-full px-4">
            <button
              className="absolute top-4 right-4 text-white"
              onClick={onClose}
            >
              <X size={30} />
            </button>

            <img
              src={images[index]}
              alt="Gallery"
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />

            <button
              className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white"
              onClick={prev}
            >
              <ChevronLeft size={30} />
            </button>
            <button
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white"
              onClick={next}
            >
              <ChevronRight size={30} />
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
