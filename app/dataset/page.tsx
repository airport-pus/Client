"use client";

import Image from "next/image";
import Link from "next/link";
import Footer from "../footer/page";
import Header from "../header/page"; 

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-4 md:p-8 bg-[#F3F4F6] font-pretendard">
        <div className="max-w-[1280px] mx-auto px-3 md:px-5">
          <Header />

          <div className="flex flex-col items-center justify-center">
            <div className="text-center max-w-[600px]">
              <h2 className="text-[24px] font-bold text-black150 mb-2 mt-[70px]">
                아래 데이터를 기반으로 개발되었어요.
              </h2>
              <p className="text-[16px] text-gray600 mb-8">
                클릭하면 데이터 세부 정보로 이동해요.
              </p>

              <div className="bg-white rounded-lg p-8 shadow-sm mb-6">
                <div className="flex items-center justify-center mb-6">
                  <span className="text-[24px] text-black">◕‿◕✿</span>
                </div>
                
                <div className="space-y-4">
                  <a 
                    href="https://www.data.go.kr/data/15110019/openapi.do" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue500 hover:underline"
                  >
                    <Image src="/link.svg" alt="link icon" width={18} height={16} className="mr-2" />
                    한국공항공사_공항 혼잡도 정보(김해, 청주, 대구공항)
                  </a>
                  <a 
                    href="https://www.data.go.kr/data/15127758/openapi.do" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue500 hover:underline"
                  >
                    <Image src="/link.svg" alt="link icon" width={18} height={16} className="mr-2" />
                    한국공항공사_김해국제공항 실시간 주기장 현황정보
                  </a>
                  <a 
                    href="https://www.data.go.kr/data/15063437/openapi.do" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue500 hover:underline"
                  >
                    <Image src="/link.svg" alt="link icon" width={18} height={16} className="mr-2" />
                    한국공항공사_전국공항 주차장 혼잡도
                  </a>
                  <a 
                    href="https://www.data.go.kr/data/15038474/openapi.do" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-blue500 hover:underline"
                  >
                    <Image src="/link.svg" alt="link icon" width={18} height={16} className="mr-2" />
                    한국공항공사_전국공항 주차요금
                  </a>
                </div>
              </div>

              <Link href="/" className="inline-block px-6 py-2 bg-blue200 text-blue500 rounded-lg hover:bg-blue150 transition-colors">
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
