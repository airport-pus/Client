"use client";

import { useState } from "react";
import Header from "../../header/page";
import React from "react";
import InquiryCheck from "../../components/Inquiry-check/page";

export default function Inquiry() {
  const [isExpanded, setExpanded] = useState<string>("");

  const items = [
    { id: 1, title: "이거 좀 이상함", content: "문의 내용이 여기에 표시됩니다.", email: "user1@example.com" },
    { id: 2, title: "이 기능이 제대로 동작하지 않아요", content: "문의 내용이 여기에 표시됩니다.", email: "user2@example.com" }
  ];

  const handleChange = (value: string) => {
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
              <InquiryCheck 
                items={items}
                isExpanded={isExpanded}
                onChangeAccordion={handleChange}
              />
            </div>
          </main>
        </div>
      </main>
    </div>
  );
}