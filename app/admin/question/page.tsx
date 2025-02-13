"use client";

import { useState } from "react";
import Footer from "../../footer/page";
import Header from "../../header/page";
import React from "react";  

export default function Inquiry() {
const [isExpanded, setExpanded] = useState<string>("");

const items = [
{ id: 1, title: "이거 좀 이상함", content: "문의 내용이 여기에 표시됩니다.", email: "user1@example.com" },
{ id: 2, title: "이 기능이 제대로 동작하지 않아요", content: "문의 내용이 여기에 표시됩니다.", email: "user2@example.com" }
];

type AccordionGenericProps = {
value: string;
};

const handleChange = ({ value }: AccordionGenericProps) => {
if (isExpanded !== value) {
  setExpanded(value);
} else {
  setExpanded("");
}
};

return (
<div className="flex flex-col min-h-screen">
  <main className="flex-grow p-8 bg-[#F3F4F6] font-pretendard">
    <div className="max-w-[1280px] mx-auto px-5">
      <Header />
      <main className="flex-grow p-8">
        <div className="max-w-[800px] mx-auto text-center">
          <h1 className="text-[24px] font-bold text-[#111827] mb-2">문의내용</h1>
          <p className="text-[16px] text-[#767676] mb-10 text-center mt-[-8]">개발자들아 일해라.</p>
          <div className="w-full space-y-2">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className="w-full border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={() => handleChange({ value: item.id.toString() })}
              >
                <div className="flex flex-col">
                  <div className="w-full flex items-center p-4 text-left text-[18px] font-semibold text-gray-500">
                    <span className="flex-1 text-[#767676] flex items-center justify-between">
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
                  <div className="text-12 text-[#767676] pb-4 px-4 text-left mt-[-16] ml-12">
                    {item.email}
                  </div>
                </div>
                {isExpanded === item.id.toString() && (
                  <div className="text-14 text-[#767676] pb-4 px-4 text-left mt-[16] ml-12">
                    {item.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  </main>
</div>
);
}