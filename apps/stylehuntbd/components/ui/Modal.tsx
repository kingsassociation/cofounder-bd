"use client";
import { X } from "lucide-react";
import React from "react";
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}: ModalProps) {
  if (!isOpen) return null;
  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`bg-white rounded-2xl shadow-2xl w-full max-h-[95vh] overflow-hidden animate-slide-up flex flex-col relative ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            {title && (
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors ml-auto"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          {}
          <div className="overflow-y-auto flex-1 p-6">{children}</div>
        </div>
      </div>
    </>
  );
}
