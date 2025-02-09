"use client";

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

          <div className="h-[80px]"></div>

          <div className="flex flex-col items-center justify-center">
            <div className="text-center max-w-[600px]">
              <h2 className="text-[24px] font-bold text-[#111827] mb-2">
                아래 데이터를 기반으로 개발되었습니다.
              </h2>
              <p className="text-[16px] text-[#6B7280] mb-8">
                클릭하면 데이터 세부정보로 이동합니다.
              </p>

              <div className="bg-white rounded-lg p-8 shadow-sm mb-6">
                <div className="flex items-center justify-center mb-6">
                  <span className="text-[24px] text-[#000000]">◕‿◕✿</span>
                </div>
                
                <div className="space-y-4">
                  <Link href="https://www.data.go.kr/data/15110019/openapi.do" className="flex items-center text-[#2563EB] hover:underline">
                    <Image src="/link.svg" alt="link icon" width={18} height={16} className="mr-2" />
                    한국공항공사_공항 혼잡도 정보(김해, 청주, 대구공항)
                  </Link>
                  <Link href="https://www.data.go.kr/data/15127758/openapi.do" className="flex items-center text-[#2563EB] hover:underline">
                    <Image src="/link.svg" alt="link icon" width={18} height={16} className="mr-2" />
                    한국공항공사_김해국제공항 실시간 주기장 현황정보
                  </Link>
                  <Link href="https://www.data.go.kr/data/15063437/openapi.do" className="flex items-center text-[#2563EB] hover:underline">
                    <Image src="/link.svg" alt="link icon" width={18} height={16} className="mr-2" />
                    한국공항공사_전국공항 주차장 혼잡도
                  </Link>
                </div>
              </div>

              <Link href="/" className="inline-block px-6 py-2 bg-[#D2E4FF] text-[#2563EB] rounded-lg hover:bg-[#D1E0FF] transition-colors">
                홈으로
              </Link>
            </div>  
          </div>
        </div>
      </main>
      <Footer className="mt-auto" />
    </div>
  );
}