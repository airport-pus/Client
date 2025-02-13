"use client";
import { useState, useEffect, useRef } from "react";
import FinshData from "../finsh-data/page";

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
    const nextFlights = allFlightData.slice(displayedFlights.length, displayedFlights.length + 10);

    setDisplayedFlights((prev) => {
      const updatedFlights = [...prev, ...nextFlights];
      if (updatedFlights.length >= allFlightData.length) {
        setHasMore(false);
      }
      return updatedFlights;
    });
  };

  useEffect(() => {
    if (displayedFlights.length >= allFlightData.length) {
      setHasMore(false);
    }
  }, [displayedFlights]);

  return (
    <>
      <div className="mt-14 p-4 border-l-4 border-blue500 bg-blue100 text-black mt-5">
        <p className="font-bold text-[19px]">도착 주기장 이용 안내</p>
        <p className="text-[16px] mt-2">• 이 주기장은 김해국제공항에 도착하는 항공기의 주기장입니다.</p>
        <p className="text-[16px] mt-1">• 항공편명을 검색하여 원하는 항공편 정보를 쉽게 확인할 수 있습니다.</p>
        <p className="text-[16px] mt-1">• <strong>예정</strong>: 계획된 도착 시간</p>
        <p className="text-[16px] mt-1">• <strong>변경</strong>: 변경된 도착 시간</p>
        <p className="text-[16px] text-red500 mt-1">• <strong>빨간색 표시</strong>: 항공편이 지연된 경우, 지연 시간을 함께 표시합니다.</p>
        <div className="mt-4">
          <div className="relative">
            <img src="/search.svg" alt="검색 아이콘" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray700" />
            <input type="text" placeholder="항공편명 검색" className="pl-10 p-2 border border-blue500 rounded w-[320px]" />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-5 bg-grayHover p-2 text-center text-gray600 font-regular text-[14px]">
        <div>항공사 및 항공편명</div>
        <div>출발지</div>
        <div>탑승구</div>
        <div>항공편 상태</div>
        <div>시간</div>
      </div>

      <FinshData displayedFlights={displayedFlights} lastFlightElementRef={lastFlightElementRef} />
    </>
  );
}
