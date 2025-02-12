"use client";
import { useState, useEffect, useRef } from "react";

export default function StartInformation() {
  const allFlightData = Array.from({ length: 40 }, (_, i) => ({
    airline: "대한항공",
    flightNumber: `KE44${i}`,
    destination: "제주",
    gate: (i % 5) + 1,
    status: i % 3 === 0 ? "지연" : "마감 예정",
    scheduledTime: `2025-02-12 08:${30 + (i % 10)}`,
    modifiedTime: `2025-02-12 08:${35 + (i % 10)}`,
    delay: i % 3 === 0 ? `${i % 10}분` : null,
    logo: "/logos/korean-air.webp",
  }));

  const [displayedFlights, setDisplayedFlights] = useState(allFlightData.slice(0, 10));
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastFlightElementRef = (node: HTMLElement | null) => {
    if (!node || !hasMore) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMoreFlights();
      }
    });
    
    observer.current.observe(node);
  };

  const loadMoreFlights = () => {
    setTimeout(() => {
      const nextFlights = allFlightData.slice(displayedFlights.length, displayedFlights.length + 10);
      setDisplayedFlights((prev) => [...prev, ...nextFlights]);
      if (displayedFlights.length + 10 >= allFlightData.length) {
        setHasMore(false);
      }
    }, 500);
  };

  return (
    <>
      <div className="mt-14 p-4 border-l-4 border-[#215DCE] bg-[#EFF6FF] text-black mt-3">
        <p className="font-bold text-[19px]">출발 주기장 이용 안내</p>
        <p className="text-[16px] mt-2">• 이 주기장은 김해국제공항에서 출발하는 항공기의 주기장입니다.</p>
        <p className="text-[16px] mt-1">• 항공편명을 검색하여 원하는 항공편 정보를 쉽게 확인할 수 있습니다.</p>
        <p className="text-[16px] mt-1">• <strong>예정</strong>: 계획된 출발 시간</p>
        <p className="text-[16px] mt-1">• <strong>변경</strong>: 변경된 출발 시간</p>
        <p className="text-[16px] text-red-500 mt-1">• <strong>빨간색 표시</strong>: 항공편이 지연된 경우, 지연 시간을 함께 표시합니다.</p>
        <div className="mt-4">
          <div className="relative">
            <img src="/search.svg" alt="검색 아이콘" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#7A7A7A]" />
            <input type="text" placeholder="항공편명 검색" className="pl-10 p-2 border border-[#215DCE] rounded w-[320px]" />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-5 bg-[#F7F7F7] p-2 text-center text-[#606060] font-regular text-[14px]">
        <div>항공사 및 항공편명</div>
        <div>도착지</div>
        <div>탑승구</div>
        <div>항공편 상태</div>
        <div>시간</div>
      </div>

      {displayedFlights.map((flight, index) => (
        <div key={index} ref={index === displayedFlights.length - 1 ? lastFlightElementRef : null} className="grid grid-cols-5 border-b p-4 items-center">
          <div className="flex items-center gap-2 ml-14">
            <img src={flight.logo} alt={flight.airline} className="w-8 h-8" />
            <div>
              <div className="text-[#000000]">{flight.flightNumber}</div>
              <div className="text-[#606060] text-sm">{flight.airline}</div>
            </div>
          </div>
          <div className="text-center text-[#000000] ml-[-10px]">{flight.destination}</div>
          <div className="text-center text-blue-500">{flight.gate}</div>
          <div className={`text-center ml-2 ${flight.status === "지연" ? "text-red-500" : "text-blue-500"}`}>{flight.status}</div>
          <div className="flex flex-col items-start ml-14">
            <div className="text-sm text-[#606060]">예정 {flight.scheduledTime}</div>
            <div className="text-sm text-[#215DCE]">변경 {flight.modifiedTime}</div>
            {flight.delay && <div className="text-red-500 text-sm">지연 {flight.delay}</div>}
          </div>
        </div>
      ))}
    </>
  );
}
