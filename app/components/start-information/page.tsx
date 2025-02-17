"use client";
import { useState, useEffect, useRef } from "react";
import StartData from "../start-data/page";
import airlineDictionary, { getLogo } from './logoList';
import Image from 'next/image';

interface FlightData {
  flightNumber: string;
  airlineEnglish: string;
  airlineKorean: string;
  arrivedEng: string;
  arrivedKor: string;
  baggageClaim: string;
  boardingEng: string;
  boardingKor: string;
  std: string | null;
  etd: string | null;
  io: string;
  line: string;
  remarkEng: string;
  remarkKor: string;
}

interface DisplayFlight {
  airline: string;
  flightNumber: string;
  destination: string;
  gate: number;
  status: string;
  scheduledTime: string;
  modifiedTime: string;
  delay: string | null;
  logo: string;
}

export default function StartInformation() {
  const [allFlightData, setAllFlightData] = useState<DisplayFlight[]>([]);
  const [displayedFlights, setDisplayedFlights] = useState<DisplayFlight[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/apron?io=I`);
        if (!response.ok) {
          throw new Error('Failed to fetch flight data');
        }
        const data: FlightData[] = await response.json();
        
        const transformedData: DisplayFlight[] = data.map((flight, index) => ({
          airline: flight.airlineKorean,
          flightNumber: flight.flightNumber,
          destination: flight.boardingKor,
          gate: parseInt(flight.baggageClaim) || (index % 5) + 1,
          status: flight.remarkKor || "-",
          scheduledTime: formatTime(flight.std),
          modifiedTime: formatTime(flight.etd),
          delay: calculateDelay(flight.std, flight.etd),
          logo: `/logos/${getLogo(flight.airlineEnglish)}`,
        }));

        setAllFlightData(transformedData);
        setDisplayedFlights(transformedData.slice(0, 10));
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setIsLoading(false);
      }
    };

    fetchFlights();
  }, []);

  const formatTime = (time: string | null): string => {
    if (!time) return "시간 미정";
    
    try {
      const hours = time.substring(0, 2);
      const minutes = time.substring(2, 4);
      if (hours && minutes) {
        return `2025-02-12 ${hours}:${minutes}`;
      }
      return "시간 미정";
    } catch (error) {
      return "시간 미정";
    }
  };

  const calculateDelay = (std: string | null, etd: string | null): string | null => {
    if (!std || !etd) return null;
    
    try {
      const stdMinutes = parseInt(std.substring(0, 2)) * 60 + parseInt(std.substring(2, 4));
      const etdMinutes = parseInt(etd.substring(0, 2)) * 60 + parseInt(etd.substring(2, 4));
      
      if (isNaN(stdMinutes) || isNaN(etdMinutes)) return null;
      
      const delayMinutes = etdMinutes - stdMinutes;
      return delayMinutes > 0 ? `${delayMinutes}분` : null;
    } catch (error) {
      return null;
    }
  };

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

  if (isLoading) {
    return <div className="text-center py-4">데이터를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red500">오류가 발생했습니다: {error}</div>;
  }

  return (
    <>
      <div className="mt-14 p-4 border-l-4 border-blue500 bg-blue100 text-black mt-5">
        <p className="font-bold text-[19px]">출발 주기장 이용 안내</p>
        <p className="text-[16px] mt-2">• 이 주기장은 김해국제공항에서 출발하는 항공기의 주기장입니다.</p>
        <p className="text-[16px] mt-1">• 항공편명을 검색하여 원하는 항공편 정보를 쉽게 확인할 수 있습니다.</p>
        <p className="text-[16px] mt-1">• <strong>예정</strong>: 계획된 출발 시간</p>
        <p className="text-[16px] mt-1">• <strong>변경</strong>: 변경된 출발 시간</p>
        <p className="text-[16px] text-red500 mt-1">• <strong>빨간색 표시</strong>: 항공편이 지연된 경우, 지연 시간을 함께 표시합니다.</p>
        <div className="mt-4">
          <div className="relative">
            <Image 
                src="/search.svg" 
                alt="검색 아이콘" 
                width={16}
                height={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray700" 
            />
            <input type="text" placeholder="항공편명 검색" className="pl-10 p-2 border border-blue500 rounded w-[320px]" />
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