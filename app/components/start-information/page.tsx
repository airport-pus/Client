"use client";
// lib
import { useState, useEffect, useRef, useMemo } from "react";
import useSWR from "swr";
import StartData from "../start-data/page";
import Image from "next/image";
// logoList
import { getLogo } from "./logoList";
// utils
import { formatTime, fetcher, calculateDelay } from "@/utils";
// type
import { FlightData } from "@/types/In/InFlightData";
import { DisplayFlight } from "@/types/In/InDisplayFlight";

export default function StartInformation() {
  const { data, error } = useSWR<FlightData[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/apron?io=O`,
    fetcher
  );
  const [displayedFlights, setDisplayedFlights] = useState<DisplayFlight[]>([]);
  const [inputValue, setInputValue] = useState("");

  // 모든 항공 데이터 (중복 제거)
  const allFlightData = useMemo(() => {
    const uniqueFlights = new Map();
    data?.forEach((flight) => {
      if (!uniqueFlights.has(flight.flightNumber)) {
        uniqueFlights.set(flight.flightNumber, {
          airline: flight.airlineKorean,
          flightNumber: flight.flightNumber,
          destination: flight.arrivedKor,
          gate: flight.gate || "-",
          status: flight.remarkKor || "-",
          scheduledTime: formatTime(flight.std),
          modifiedTime: formatTime(flight.etd),
          delay: calculateDelay(flight.std, flight.etd),
          logo: `/logos/${getLogo(flight.airlineEnglish)}`,
        });
      }
    });
    return Array.from(uniqueFlights.values());
  }, [data]);

  useEffect(() => {
    if (inputValue.trim()) {
      const filteredFlights = allFlightData.filter((flight) =>
        flight.flightNumber.toLowerCase().includes(inputValue.toLowerCase())
      );
      setDisplayedFlights(filteredFlights);
    } else {
      setDisplayedFlights(allFlightData.slice(0, 10));
    }
  }, [inputValue, allFlightData]);

  // 무한 스크롤 처리 (검색 중이 아닐 때만 추가 로드)
  const observer = useRef<IntersectionObserver | null>(null);
  const lastFlightElementRef = (node: HTMLElement | null) => {
    if (!node) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMoreFlights();
      }
    });
    observer.current.observe(node);
  };

  const loadMoreFlights = () => {
    if (inputValue.trim()) return;
    setDisplayedFlights((prev) => [
      ...prev,
      ...allFlightData.slice(prev.length, prev.length + 10),
    ]);
  };

  // 에러 발생 시
  if (error) {
    return (
      <div className="text-center py-4 text-red500">
        오류 발생: {error.message}
      </div>
    );
  }

  // 데이터 로딩 중 (스켈레톤 UI)
  if (!data) {
    return (
      <div className="mt-14">
        <div className="p-4 border-l-4 border-blue500 bg-blue100">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-6 w-full bg-gray-200 rounded animate-pulse mb-2"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  // 정상 화면
  return (
    <>
      <div className="mt-14 p-4 border-l-4 border-blue500 bg-blue100 text-black mt-5">
        <p className="font-bold text-[19px]">출발 주기장 이용 안내</p>
        <p className="text-[16px] mt-2">
          • 이 주기장은 김해국제공항에서 출발하는 항공기의 주기장입니다.
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
              width={24}
              height={24}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray700"
            />
            <input
              type="text"
              placeholder="항공편명 검색"
              className="pl-10 p-2 border border-blue500 rounded w-[320px]"
              onChange={(e) => setInputValue(e.target.value)}
              value={inputValue}
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-5 bg-grayHover p-2 text-center text-gray600 font-regular text-[14px]">
        <div>항공사 및 항공편명</div>
        <div>도착지</div>
        <div>탑승구</div>
        <div>항공편 상태</div>
        <div>시간</div>
      </div>

      {displayedFlights.length === 0 && inputValue && (
        <div className="text-center text-gray700 mt-8 mb-4">
          검색한 항공편에 대한 정보가 없습니다.
        </div>
      )}

      <StartData
        displayedFlights={displayedFlights}
        lastFlightElementRef={lastFlightElementRef}
      />
    </>
  );
}
