"use client";

import Image from "next/image";
import Link from "next/link";
import Footer from "../footer/page";
import Header from "../header/page"; 

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-4 md:p-8 bg-white">
        <div className="max-w-[1280px] mx-auto px-3 md:px-5">
          <Header />
          <div className="h-[76px] shrink-0" aria-hidden="true" />

          <div className="flex flex-col items-center justify-center">
            <div className="text-center max-w-[600px]">
              <h2 className="text-[24px] font-bold text-black150 mb-2 mt-[70px]">
                ios에서도 앱을 설치할 수 있어요.
              </h2>
              <p className="text-[16px] text-gray600 mb-8">
                설치 방법을 확인해주세요.
              </p>

              <div className="bg-white rounded-lg p-8 shadow-sm mb-6">
                <div className="flex items-center justify-center mb-6">
                  <span className="text-[24px] text-black">◕‿◕✿</span>
                </div>
                
                <div className="space-y-4 text-left">
                  <div className="flex items-center">
                    <span className="text-[16px] text-black">1.</span>
                    <span className="text-[15px] text-black ml-2">
                      <span className="text-blue500">safari</span>에서
                      <Image
                        src="/ios-icon.svg"
                        alt="iOS Icon"
                        width={20}
                        height={20}
                        className="inline ml-1 mb-1"
                      />
                      <span className="text-blue500"> 공유 버튼</span>을 눌러주세요.
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[16px] text-black">2.</span>
                    <span className="text-[15px] text-black ml-2">
                      홈 화면에 추가, 추가를 눌려주세요.
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/"
                className="inline-block px-6 py-2 bg-blue200 text-blue500 rounded-lg hover:bg-blue150 transition-colors"
              >
                확인
              </Link>
            </div>  
          </div>
        </div>
      </main>
      <Footer className="mt-auto" />
    </div>
  );
}
