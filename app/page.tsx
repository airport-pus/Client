"use client";

import { useState } from "react";
import Image from "next/image";
import Footer from "./footer/page";

export default function Home() {
  const [selected, setSelected] = useState<number>(1);

  const handleButtonClick = (index: number) => {
    setSelected(index);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-8 bg-[#F3F4F6] font-pretendard">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="col-span-12 flex items-center gap-4 mb-8">
            <Image
              src="/logo.svg"
              alt="PUSAN logo"
              width={100}
              height={100}
            />
            <div>
              <h1 className="text-[24px] font-bold text-[#000000]">
                김해국제공항의 모든 정보를 한 곳에서,
              </h1>
              <p className="text-[16px] text-[#6B7280]">
                지금까지 <span className="text-[#215DCE] font-semibold">333</span>명이 페이지에 방문했어요.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-5 mb-5">
            <div className="col-span-6 bg-white rounded-[8px] h-[300px] w-[610px]"></div>
            <div className="col-span-6 bg-white rounded-[8px] h-[300px] w-[610px]"></div>
          </div>

          <div className="grid grid-cols-12 gap-5 mb-5 bg-[#CDD4E5] rounded-lg p-2">
            <button
              className={`col-span-4 py-2 px-4 rounded-[8px] text-[16px] transition-colors ${
                selected === 1
                  ? "bg-white text-[#2A5FEC] font-[600]"
                  : "text-[#484848]"
              }`}
              onClick={() => handleButtonClick(1)}
            >
              실시간 구간별 혼잡도
            </button>
            <button
              className={`col-span-4 py-2 px-4 rounded-[8px] text-[16px] transition-colors ${
                selected === 2
                  ? "bg-white text-[#2A5FEC] font-[600]"
                  : "text-[#484848]"
              }`}
              onClick={() => handleButtonClick(2)}
            >
              실시간 출발 주기장 정보
            </button>
            <button
              className={`col-span-4 py-2 px-4 rounded-[8px] text-[16px] transition-colors ${
                selected === 3
                  ? "bg-white text-[#2A5FEC] font-[600]"
                  : "text-[#484848]"
              }`}
              onClick={() => handleButtonClick(3)}
            >
              실시간 도착 주기장 정보
            </button>
          </div>

          <div className="col-span-12 bg-white rounded-lg p-4 min-h-[400px]"></div>
        </div>
      </main>
      <Footer className="mt-auto" />
    </div>
  );
}
