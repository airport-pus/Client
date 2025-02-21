"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function Header() {
  const [visitCount, setVisitCount] = useState<number>(0);

  useEffect(() => {
    const incrementAndFetchVisitCount = async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/visit`, {
          method: 'POST',
        });
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/visit`);
        const count = await response.text();
        setVisitCount(Number(count));
      } catch (error) {
        console.error('방문자 수 처리 중 오류가 발생했습니다:', error);
      }
    };

    incrementAndFetchVisitCount();
  }, []);

  return (
    <div className="col-span-12 flex items-center gap-4 mb-6 mt-10 md:mt-0">
      <Link href="/dataset">
        <Image 
          src="/logo.svg" 
          alt="PUSAN logo" 
          width={80} 
          height={80}
          className="md:w-[100px] md:h-[100px]" 
        />
      </Link>
      <div className="flex-grow">
        <h1 className="text-[20px] lg:text-[24px] font-bold text-black whitespace-nowrap">
          <span className="md:hidden">airport-pus</span>
          <span className="hidden md:inline">김해국제공항의 모든 정보를 한 곳에서,</span>
        </h1>
        <p className="text-[16px] text-gray600">
          <span className="hidden md:inline">지금까지 </span>
          <span className="text-blue500 font-semibold">
            {visitCount.toLocaleString()}
          </span>
          <span className="md:hidden">명이 방문했어요.</span>
          <span className="hidden md:inline">명이 페이지에 방문했어요.</span>
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <Link 
          href="/dataset" 
          className="text-grayCustom text-[14px] ml-4 mt-[-20px] cursor-pointer hidden md:block"
        >
          데이터셋
        </Link>

        <span className="hidden md:inline text-grayCustom text-[14px] ml-4 mt-[-20px]">
          <Link href="https://docs.google.com/forms/d/e/1FAIpQLSeUhXwKLTGywR7-K-5tq480NcKpLVGyf_A0n_6BP8onk0uPSQ/viewform?usp=dialog">
            문의하기 
          </Link>
        </span>

        <span
          className="md:hidden text-grayCustom text-[14px] ml-4 inline-block relative"
          style={{ left: "-12px" }}
        >
          <Link href="https://docs.google.com/forms/d/e/1FAIpQLSeUhXwKLTGywR7-K-5tq480NcKpLVGyf_A0n_6BP8onk0uPSQ/viewform?usp=dialog">
            문의
          </Link>
        </span>
      </div>
    </div>
  )
}
