"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link"; 
import Footer from ".././footer/page";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-8 bg-[#F3F4F6] font-pretendard">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="col-span-12 flex items-center gap-4 mb-6">
            <Image src="/logo.svg" alt="PUSAN logo" width={100} height={100} />
            <div className="flex-grow">
              <h1 className="text-[24px] font-bold text-[#000000]">
                김해국제공항의 모든 정보를 한 곳에서,
              </h1>
              <p className="text-[16px] text-[#6B7280]">
                지금까지 <span className="text-[#215DCE] font-semibold">333</span>명이 페이지에 방문했어요.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dataset">
                <div className="text-[#606060] text-[14px] ml-4 cursor-pointer">데이터셋</div>
              </Link>
              <div className="text-[#606060] text-[14px] ml-4">문의하기</div>
            </div>
          </div>
        </div>
      </main>
      <Footer className="mt-auto" />
    </div>
  );
}