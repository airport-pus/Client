"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import useSWR from "swr";
import StartData from "../finsh-data/page";
import airlineDictionary, { getLogo } from "./logoList";
import Image from 'next/image';
// utils
import { formatTime, fetcher, calculateDelay, getRemarkKor } from "@/utils"
// type
import { FlightData } from "@/types/OutFlightData";
import { DisplayFlight } from "@/types/OutDisplayData";


export default function StartInformation() {
  const { data, error } = useSWR<FlightData[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/apron?io=I`,
    fetcher
  );

  const [displayedFlights, setDisplayedFlights] = useState<DisplayFlight[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);

  const allFlightData = useMemo<DisplayFlight[]>(() => {
    if (!data) return [];
    return data.map((flight) => ({
      airline: flight.airlineKorean,
      flightNumber: flight.flightNumber,
      destination: flight.boardingKor,
      gate: flight.baggageClaim || "-",
      status: getRemarkKor(flight) || "-",
      scheduledTime: formatTime(flight.std),
      modifiedTime: formatTime(flight.etd),
      delay: calculateDelay(flight.std, flight.etd),
      logo: `/logos/${getLogo(flight.airlineEnglish)}`,
    }));
  }, [data]);

  useEffect(() => {
    if (allFlightData.length > 0) {
      setDisplayedFlights(allFlightData.slice(0, 10));
      setHasMore(allFlightData.length > 10);
    }
  }, [allFlightData]);

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
    const nextFlights = allFlightData.slice(
      displayedFlights.length,
      displayedFlights.length + 10
    );
    setDisplayedFlights((prev) => {
      const updatedFlights = [...prev, ...nextFlights];
      if (updatedFlights.length >= allFlightData.length) {
        setHasMore(false);
      }
      return updatedFlights;
    });
  };

  if (error) {
    return (
      <div className="text-center py-4 text-red500">오류가 발생했습니다: {error.message}</div>
    );
  }

  if (!data) {
    return (
      <div className="mt-14">
        <div className="p-4 border-l-4 border-blue500 bg-blue100">
          <div className="h-7 w-56 bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="h-6 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-6 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-6 w-96 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="mt-4">
            <div className="relative">
              <div className="h-10 w-[320px] bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-5 bg-grayHover p-2 text-center">
          <div className="h-5 w-36 bg-gray-200 rounded animate-pulse mx-auto"></div>
          <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mx-auto"></div>
          <div className="h-5 w-20 bg-gray-200 rounded animate-pulse mx-auto"></div>
          <div className="h-5 w-28 bg-gray-200 rounded animate-pulse mx-auto"></div>
          <div className="h-5 w-16 bg-gray-200 rounded animate-pulse mx-auto"></div>
        </div>

        {[...Array(5)].map((_, i) => (
          <div key={i} className="grid grid-cols-5 p-4 border-b text-center">
            <div className="flex items-center gap-2 justify-center">
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="h-5 w-28 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mx-auto"></div>
            <div className="h-5 w-16 bg-gray-200 rounded animate-pulse mx-auto"></div>
            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse mx-auto"></div>
            <div className="flex flex-col items-center gap-1">
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="mt-14 p-4 border-l-4 border-blue500 bg-blue100 text-black mt-5">
        <p className="font-bold text-[19px]">도착 주기장 이용 안내</p>
        <p className="text-[16px] mt-2">
          • 이 주기장은 김해국제공항에 도착하는 항공기의 주기장입니다.
        </p>
        <p className="text-[16px] mt-1">
          • 항공편명을 검색하여 원하는 항공편 정보를 쉽게 확인할 수 있습니다.
        </p>
        <p className="text-[16px] mt-1">
          • <strong>예정</strong>: 계획된 출발 시간
        </p>
        <p className="text-[16px] mt-1">
          • <strong>변경</strong>: 변경된 출발 시간
        </p>
        <p className="text-[16px] text-red500 mt-1">
          • <strong>빨간색 표시</strong>: 항공편이 지연된 경우, 지연 시간을 함께 표시합니다.
        </p>
        <div className="mt-4">
          <div className="relative">
            <Image
              src="/search.svg"
              alt="검색 아이콘"
              width={16}
              height={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray700"
            />
            <input
              type="text"
              placeholder="항공편명 검색"
              className="pl-10 p-2 border border-blue500 rounded w-[320px]"
            />
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
      <StartData
        displayedFlights={displayedFlights}
        lastFlightElementRef={lastFlightElementRef}
      />
    </>
  );
}
