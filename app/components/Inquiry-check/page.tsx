"use client";

import React from "react";

interface InquiryItem {
  id: number;
  title: string;
  content: string;
  email: string;
}

interface InquiryCheckProps {
  items: InquiryItem[];
  isExpanded: string;
  onChangeAccordion: (value: string) => void;
}

export default function InquiryCheck({ items, isExpanded, onChangeAccordion }: InquiryCheckProps) {
  return (
    <div className="w-full space-y-2">
      {items.map((item) => (
        <div 
          key={item.id} 
          className="w-full border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
          onClick={() => onChangeAccordion(item.id.toString())}
        >
          <div className="flex flex-col">
            <div className="w-full flex items-center p-4 text-left text-[18px] font-semibold text-gray-500">
              <span className="flex-1 text-gray800 flex items-center justify-between">
                <div>
                  Q. <span className="text-black ml-6">{item.title}</span>
                </div>
                <svg 
                  className={`w-4 h-4 transform transition-transform duration-200 ${
                    isExpanded === item.id.toString() ? 'rotate-180' : ''
                  }`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </div>
            <div className="text-12 text-gray800 pb-4 px-4 text-left mt-[-16] ml-12">
              {item.email}
            </div>
          </div>
          {isExpanded === item.id.toString() && (
            <div className="text-14 text-gray800 pb-4 px-4 text-left mt-[16] ml-12">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}