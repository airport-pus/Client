"use client"

import Image from "next/image"
import Link from "next/link"

export default function Header() {
  return (
    <div className="col-span-12 flex items-center gap-4 mb-6">
      <Image src="/logo.svg" alt="PUSAN logo" width={100} height={100} />
      <div className="flex-grow">
        <h1 className="text-[20px] lg:text-[24px] font-bold text-black">김해국제공항의 모든 정보를 한 곳에서,</h1>
        <p className="text-[16px] text-gray600">
          지금까지 <span className="text-blue500 font-semibold">333</span>명이 페이지에 방문했어요.
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/dataset" className="text-grayCustom text-[14px] ml-4 mt-[-20px] cursor-pointer">
          데이터셋
        </Link>
        <span className="text-grayCustom text-[14px] ml-4 mt-[-20px]">문의하기</span>
      </div>
    </div>
  )
}