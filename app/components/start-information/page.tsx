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

// StartInformation
export default function StartInformation() {
  const { data, error } = useSWR<FlightData[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/apron?io=O`,
    fetcher
  );
  const [displayedFlights, setDisplayedFlights] = useState<DisplayFlight[]>([]);
  const [inputValue, setInputValue] = useState("");

  // 모든 항공 데이터
  const allFlightData = useMemo(() => {
    return data
      ? data.map((flight) => ({
          airline: flight.airlineKorean,
          flightNumber: flight.flightNumber,
          destination: flight.boardingKor,
          gate: flight.gate || "-",
          status: flight.remarkKor || "-",
          scheduledTime: formatTime(flight.std),
          modifiedTime: formatTime(flight.etd),
          delay: calculateDelay(flight.std, flight.etd),
          logo: `/logos/${getLogo(flight.airlineEnglish)}`,
        }))
      : [];
  }, [data]);

  // 전체 데이터 초기 로드
  useEffect(() => {
    if (allFlightData.length > 0) {
      setDisplayedFlights(allFlightData.slice(0, 10));
    }
  }, [allFlightData]);

  // 무한 스크롤 처리
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

  // 추가 항공편 로드
  const loadMoreFlights = () => {
    setDisplayedFlights((prev) => [
      ...prev,
      ...allFlightData.slice(prev.length, prev.length + 10),
    ]);
  };

  // 검색 기능
  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (!inputValue.trim()) {
        alert("검색할 비행기 번호를 입력하세요.");
        return;
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/apron/flight?flightNumber=${inputValue}`;
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          alert(response.status === 404 ? "해당 비행기가 없습니다." : "오류 발생");
          return;
        }

        const flight = await response.json();
        setDisplayedFlights([
          {
            airline: flight.airlineKorean,
            flightNumber: flight.flightNumber,
            destination: flight.boardingKor,
            gate: flight.gate || "-",
            status: flight.remarkKor || "-",
            scheduledTime: formatTime(flight.std),
            modifiedTime: formatTime(flight.etd),
            delay: calculateDelay(flight.std, flight.etd),
            logo: `/logos/${getLogo(flight.airlineEnglish)}`,
          },
        ]);
      } catch (error) {
        console.error("API 요청 중 오류 발생:", error);
        alert("네트워크 오류 발생");
      }
    }
  };

  // 에러 발생 시
  if (error) {
    return <div className="text-center py-4 text-red500">오류 발생: {error.message}</div>;
  }

  // 데이터 로딩 중 (스켈레톤 UI)
  if (!data) {
    return (
      <div className="mt-14">
        <div className="p-4 border-l-4 border-blue500 bg-blue100">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-6 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  // 정상 화면
  return (
    <>
      <div className="mt-14 p-4 border-l-4 border-blue500 bg-blue100 text-black">
        <p className="font-bold text-[19px]">출발 주기장 이용 안내</p>
        <p className="text-[16px] mt-2">• 이 주기장은 김해국제공항에서 출발하는 항공기의 주기장입니다.</p>
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
              onKeyDown={handleKeyDown}
              onChange={(e) => setInputValue(e.target.value)}
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

      <StartData displayedFlights={displayedFlights} lastFlightElementRef={lastFlightElementRef} />
    </>
  );
}
