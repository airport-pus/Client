"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import useSWR from "swr";
import StartData from "../start-data/test";
import { getLogo } from "./logoList";
import Image from "next/image";
// utils
import { formatTime, fetcher, calculateDelay } from "@/utils";
// type
import { DisplayFlight } from "@/types/FinishDisplayFlight";
import { FlightData } from "@/types/FinishFlightData";

export default function StartInformation() {
  const { data, error } = useSWR<FlightData[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/apron?io=I`,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 30000,
      dedupingInterval: 60000,
    }
  );

  const [displayedFlights, setDisplayedFlights] = useState<DisplayFlight[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [selectedType, setSelectedType] = useState("all");
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const allFlightData = useMemo<DisplayFlight[]>(() => {
    if (!data) return [];
    const uniqueFlights = new Map<string, DisplayFlight>();
    data.forEach((flight) => {
      const processedFlight = {
        airline: flight.airlineKorean,
        flightNumber: flight.flightNumber,
        destination: flight.boardingKor,
        gate: flight.baggageClaim || "-",
        status: flight.remarkKor || "-",
        scheduledTime: formatTime(flight.std),
        modifiedTime: formatTime(flight.etd || "-"),
        delay: calculateDelay(flight.std, flight.etd || "0"),
        logo: `/logos/${getLogo(flight.airlineEnglish)}`,
      };

      if (!uniqueFlights.has(flight.flightNumber)) {
        uniqueFlights.set(flight.flightNumber, processedFlight);
      } else {
        const existingFlight = uniqueFlights.get(flight.flightNumber);
        if (existingFlight) {
          const existingNullCount = [existingFlight.gate, existingFlight.modifiedTime, existingFlight.delay].filter(v => v === "-").length;
          const newNullCount = [processedFlight.gate, processedFlight.modifiedTime, processedFlight.delay].filter(v => v === "-").length;

          if (newNullCount < existingNullCount) {
            uniqueFlights.set(flight.flightNumber, processedFlight);
          }
        }
      }
    });
    return Array.from(uniqueFlights.values());
  }, [data]);

  useEffect(() => {
    const filtered = allFlightData.filter((flight) =>
      flight.flightNumber.toLowerCase().includes(inputValue.toLowerCase())
    );
    if (inputValue.trim()) {
      setDisplayedFlights(filtered);
      setHasMore(false);
    } else {
      if (isMobile) {
        setDisplayedFlights(filtered);
        setHasMore(false);
      } else {
        setDisplayedFlights(allFlightData.slice(0, 10));
        setHasMore(allFlightData.length > 10);
      }
    }
  }, [inputValue, allFlightData, isMobile]);

  const lastFlightElementRef = (node: HTMLElement | null) => {
    if (isMobile || !node || !hasMore) return;
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
    const nextFlights = allFlightData.slice(
      displayedFlights.length,
      displayedFlights.length + 10
    );
    setDisplayedFlights((prev) => {
      const updated = [...prev, ...nextFlights];
      if (updated.length >= allFlightData.length) {
        setHasMore(false);
      }
      return updated;
    });
  };

  if (error) {
    return (
      <div className="text-center py-4 text-red500">
        오류가 발생했습니다: {error.message}
      </div>
    );
  }

  if (!data) {
    return (
      <>
        <div className="mt-5 p-4 border-l-4 border-blue500 bg-blue100 text-black">
          <div className="mb-4">
            <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-6 w-full bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-6 w-5/6 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-6 w-1/3 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-[320px] bg-gray-200 rounded animate-pulse pl-10"></div>
          </div>
        </div>

        {isMobile ? (
          <div className="md:hidden divide-y divide-gray-300">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-white p-4 animate-pulse">
                <div className="flex justify-between items-center mb-2">
                  <div className="bg-gray-200 h-6 w-40 rounded"></div>
                  <div className="bg-gray-200 h-6 w-10 rounded"></div>
                </div>
                <div className="mb-1">
                  <div className="bg-gray-200 h-5 w-24 rounded"></div>
                </div>
                <div className="mb-1">
                  <div className="bg-gray-200 h-5 w-16 rounded"></div>
                </div>
                <div className="mb-1">
                  <div className="bg-gray-200 h-5 w-20 rounded"></div>
                </div>
                <div className="mb-1">
                  <div className="bg-gray-200 h-5 w-24 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="hidden md:block">
            <div className="mt-6 grid grid-cols-5 bg-grayHover p-2 text-center text-gray600 font-regular text-[14px]">
              <div className="bg-gray-200 h-8 w-36 rounded animate-pulse mx-auto"></div>
              <div className="bg-gray-200 h-5 w-24 rounded animate-pulse mx-auto"></div>
              <div className="bg-gray-200 h-5 w-12 rounded animate-pulse mx-auto"></div>
              <div className="bg-gray-200 h-5 w-16 rounded animate-pulse mx-auto"></div>
              <div className="bg-gray-200 h-5 w-16 rounded animate-pulse mx-auto"></div>
            </div>
            <div className="mt-2 space-y-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-5 gap-2 p-2 border-b border-gray-300 text-center text-gray600 font-regular text-[14px]"
                >
                  <div className="flex justify-center items-center">
                    <div className="bg-gray-200 rounded animate-pulse h-8 w-36"></div>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="bg-gray-200 rounded animate-pulse h-5 w-24"></div>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="bg-gray-200 rounded animate-pulse h-5 w-12"></div>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="bg-gray-200 rounded animate-pulse h-5 w-16"></div>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="bg-gray-200 rounded animate-pulse h-5 w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
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
        <div className="mt-4 flex items-center gap-3">
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
              className="pl-10 p-2 border border-blue500 rounded w-[280px] focus:outline-none focus:ring-2 focus:ring-blue500/50"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="p-2 border border-blue500 rounded bg-white text-[14px] focus:outline-none focus:ring-2 focus:ring-blue500/50 cursor-pointer"
          >
            <option value="all">전체</option>
            <option value="domestic">국내선</option>
            <option value="international">국제선</option>
          </select>
        </div>
      </div>

      <div className="hidden md:block">
        <div className="mt-6 grid grid-cols-5 bg-grayHover p-2 text-center text-gray600 font-regular text-[14px]">
          <div>항공사 및 항공편명</div>
          <div>도착지</div>
          <div>탑승구</div>
          <div>항공편 상태</div>
          <div>시간</div>
        </div>

        {displayedFlights.length === 0 && !inputValue && (
          <div className="text-center text-gray700 mt-8 mb-4">
            현재 출발 주기장에 대한 항공편 정보가 없습니다.
          </div>
        )}
        {displayedFlights.length === 0 && inputValue && (
          <div className="text-center text-gray700 mt-8 mb-4">
            검색한 항공편에 대한 정보가 없습니다.
          </div>
        )}

        <StartData
          displayedFlights={displayedFlights}
          lastFlightElementRef={lastFlightElementRef}
        />
      </div>

      <div className="md:hidden divide-y divide-gray-300">
        {displayedFlights.length === 0 && !inputValue && (
          <div className="text-center text-gray700 mt-8 mb-4">
            현재 도착 주기장에 대한 항공편 정보가 없습니다.
          </div>
        )}
        {displayedFlights.length === 0 && inputValue && (
          <div className="text-center text-gray700 mt-8 mb-4">
            검색한 항공편에 대한 정보가 없습니다.
          </div>
        )}
        {displayedFlights.map((flight, index) => (
          <div key={`${flight.flightNumber}-${index}`} className="bg-white p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="font-bold text-lg text-black">
                {flight.airline} {flight.flightNumber}
              </div>
              <Image
                src={flight.logo}
                alt={flight.airline}
                width={40}
                height={40}
              />
            </div>
            <div className="mb-1 text-gray600">
              <strong className="font-medium">출발지: </strong>
              <span className="text-black">{flight.destination}</span>
            </div>
            <div className="mb-1 text-gray600">
              <strong className="font-medium">탑승구: </strong>
              <span className="text-blue500">{flight.gate}</span>
            </div>
            <div className="mb-1 text-gray600">
              <strong className="font-medium">상태: </strong>
              <span
                className={`text-${
                  flight.status === "지연" ? "red500" : "blue500"
                }`}
              >
                {flight.status}
              </span>
            </div>
            <div className="text-gray600">
              {flight.scheduledTime === flight.modifiedTime ? (
                <span>
                  <strong className="font-medium">시간: </strong>{" "}
                  {flight.modifiedTime}
                </span>
              ) : (
                <span>
                  <div>
                    <strong className="font-medium">예정: </strong>{" "}
                    {flight.scheduledTime}
                  </div>
                  <div>
                    <strong className="font-medium">변경: </strong>{" "}
                    {flight.modifiedTime}
                    {flight.delay && (
                      <span className="text-red500"> ({flight.delay})</span>
                    )}
                  </div>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
