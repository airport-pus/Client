"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface ParkingFeeRequest {
  holidayMinutes: number;
  weekdayMinutes: number;
  parkingLot: string;
  isLargeCar: boolean;
  discountType: number;
}

const HOLIDAYS_2024 = [
  "2024-01-01", // 신정
  "2024-02-09", // 설날
  "2024-02-10", // 설날
  "2024-02-11", // 설날
  "2024-02-12", // 대체공휴일
  "2024-03-01", // 삼일절
  "2024-04-10", // 21대 총선
  "2024-05-05", // 어린이날
  "2024-05-06", // 대체공휴일
  "2024-05-15", // 부처님오신날
  "2024-06-06", // 현충일
  "2024-08-15", // 광복절
  "2024-09-16", // 추석
  "2024-09-17", // 추석
  "2024-09-18", // 추석
  "2024-10-03", // 개천절
  "2024-10-09", // 한글날
  "2024-12-25", // 성탄절
];

const getDiscountType = (discount: string): number => {
  const discountMap: { [key: string]: number } = {
    'normal': 0,
    'compact': 1,
    'eco12': 2,
    'eco3': 3,
    'disabled': 4,
    'children': 5,
    'veteran': 6
  };
  return discountMap[discount] || 0;
};

const isHoliday = (date: Date): boolean => {
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  
  const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isLegalHoliday = HOLIDAYS_2024.includes(formatDate(date));
  return isWeekend || isLegalHoliday;
};

const calculateMinutesBetweenDates = (
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string
): { weekdayMinutes: number; holidayMinutes: number } => {
  let currentDate = new Date(`${startDate}T${startTime}`);
  const endDateTime = new Date(`${endDate}T${endTime}`);
  let weekdayMinutes = 0;
  let holidayMinutes = 0;

  if (endDateTime <= currentDate) {
    return { weekdayMinutes: 0, holidayMinutes: 0 };
  }

  while (currentDate < endDateTime) {
    const nextDate = new Date(currentDate);
    nextDate.setMinutes(nextDate.getMinutes() + 1);

    if (isHoliday(currentDate)) {
      holidayMinutes++;
    } else {
      weekdayMinutes++;
    }
    currentDate = nextDate;
  }

  return { weekdayMinutes, holidayMinutes };
};

export default function ParkingFeeCalculator() {
  const [startDate, setStartDate] = useState("2023-03-13")
  const [startTime, setStartTime] = useState("00:00")
  const [endDate, setEndDate] = useState("2023-03-13")
  const [endTime, setEndTime] = useState("00:00")
  const [selectedParking, setSelectedParking] = useState("P1P2")
  const [selectedSize, setSelectedSize] = useState("small")
  const [selectedDiscount, setSelectedDiscount] = useState("normal")
  const [parkingFee, setParkingFee] = useState<number | null>(null)
  const [isResultView, setIsResultView] = useState(false)

  useEffect(() => {
    const today = new Date()
    const start = new Date(today)
    start.setDate(today.getDate() - 7)
    const end = new Date(today) 

    const formatDate = (date: Date) => {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, "0")
      const day = date.getDate().toString().padStart(2, "0")
      return `${year}-${month}-${day}`
    }

    setStartDate(formatDate(start))
    setEndDate(formatDate(end))
  }, [])

  const calculateParkingFee = async () => {
    try {
      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(`${endDate}T${endTime}`);
      
      if (endDateTime <= startDateTime) {
        alert('출차 시간은 입차 시간보다 늦어야 합니다.');
        return;
      }

      const { weekdayMinutes, holidayMinutes } = calculateMinutesBetweenDates(
        startDate,
        startTime,
        endDate,
        endTime
      );

      const parkingFeeRequest: ParkingFeeRequest = {
        holidayMinutes,
        weekdayMinutes,
        parkingLot: selectedParking === "P1P2" ? "P1" : "P3",
        isLargeCar: selectedSize === "large",
        discountType: getDiscountType(selectedDiscount)
      };

      console.log('Sending request:', parkingFeeRequest);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/parking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parkingFeeRequest),
      });

      if (!response.ok) {
        throw new Error(`Failed to calculate parking fee: ${response.status}`);
      }

      const text = await response.text();
      const fee = Number(text);
      setParkingFee(fee);
      setIsResultView(true);
    } catch (error) {
      console.error('Error calculating parking fee:', error);
      alert('주차 요금 계산 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="col-span-12 sm:col-span-4 bg-white rounded-[8px] h-[260px] p-6 relative w-[700px] absolute xl:left-[-300px]">
      {!isResultView ? (
        <>
          <h2 className="text-xl font-bold mb-4 text-black">
            예상 주차요금 조회
          </h2>

          <div className="flex mb-4 mt-[20px]">
            <div className="flex-1">
              <span className="text-sm font-semibold text-gray600">주차장 선택</span>
              <div className="flex items-center mt-2">
                <label className="flex items-center mr-4 cursor-pointer">
                  <input
                    type="radio"
                    name="parking"
                    checked={selectedParking === "P1P2"}
                    onChange={() => setSelectedParking("P1P2")}
                    className="mr-2"
                  />
                  <span className={selectedParking === "P1P2" ? "font-medium text-black" : "text-gray575"}>
                    P1·P2 주차장
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="parking"
                    checked={selectedParking === "P3"}
                    onChange={() => setSelectedParking("P3")}
                    className="mr-2"
                  />
                  <span className={selectedParking === "P3" ? "font-medium text-black" : "text-gray575"}>
                    P3 (화물)
                  </span>
                </label>
              </div>
            </div>

            <div className="mb-4 ml-[40px]">
              <span className="text-sm font-semibold text-gray600">차량 크기 선택</span>
              <div className="flex items-center mt-2">
                <label className="flex items-center mr-4 cursor-pointer">
                  <input
                    type="radio"
                    name="size"
                    checked={selectedSize === "small"}
                    onChange={() => setSelectedSize("small")}
                    className="mr-2"
                  />
                  <span className={selectedSize === "small" ? "font-medium text-black" : "text-gray575"}>
                    소형
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="size"
                    checked={selectedSize === "large"}
                    onChange={() => setSelectedSize("large")}
                    className="mr-2"
                  />
                  <span className={selectedSize === "large" ? "font-medium text-black" : "text-gray575"}>
                    대형
                  </span>
                </label>
              </div>
            </div>
            
            <div className="mb-4 mt-[-3px] ml-[120px]">
              <span className="text-sm font-semibold text-gray600 ml-[-40px]">할인</span>
              <div className="flex items-center mt-[2]">
                <select
                  className="border px-3 py-1 rounded-md text-gray500 bg-blue100 border-blue200 appearance-none"
                  value={selectedDiscount}
                  onChange={(e) => setSelectedDiscount(e.target.value)}
                  style={{
                    transform: 'translateX(-40px) translateY(3px)',
                  }}
                >
                  <option value="normal">일반</option>
                  <option value="veteran">국가유공자(상이)</option>
                  <option value="disabled">장애인 차량</option>
                  <option value="eco3">저공해 3종</option>
                  <option value="eco12">저공해 1,2종</option>
                  <option value="compact">경차</option>
                  <option value="children">다자녀</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-4 mt-[-8px] flex items-center">
            <div className="flex-1">
              <span className="text-sm font-semibold text-gray600">입·출차 시간 선택</span>
              <div className="flex items-center mt-2">
                <input
                  type="date"
                  className="border px-2 py-1 rounded-md mr-2 text-gray500 bg-blue100 border-blue200"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <select
                  className="border px-2 py-1 rounded-md mr-4 text-gray500 bg-blue100 border-blue200 appearance-none"
                  style={{ WebkitAppearance: "none", MozAppearance: "none" }}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                >
                  {Array.from({ length: 48 }, (_, i) => {
                    const hour = Math.floor(i / 2).toString().padStart(2, "0")
                    const minute = i % 2 === 0 ? "00" : "30"
                    return `${hour}:${minute}`
                  }).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                <span className="text-gray500">~</span>
                <input
                  type="date"
                  className="border px-2 py-1 rounded-md ml-4 mr-2 text-gray500 bg-blue100 border-blue200"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <select
                  className="border px-2 py-1 rounded-md text-gray500 bg-blue100 border-blue200 appearance-none"
                  style={{ WebkitAppearance: "none", MozAppearance: "none" }}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                >
                  {Array.from({ length: 48 }, (_, i) => {
                    const hour = Math.floor(i / 2).toString().padStart(2, "0")
                    const minute = i % 2 === 0 ? "00" : "30"
                    return `${hour}:${minute}`
                  }).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button 
              className="h-[36px] w-[96px] bg-blue500 text-white px-2 rounded-[8px] ml-2 mt-8 transition-all duration-200 ease-in-out"
              style={{ transform: 'translateX(-36px)' }}
              onClick={calculateParkingFee}
            >
              🚗 조회
            </button>
          </div>
        </>
      ) : (
        <div className="flex items-center flex-col justify-center h-full gap-1">
          <Image src="/Payment.svg" alt="payment" width={180} height={50} />
          <p className="text-[20px] font-bold text-black mb-4 mt-2">
            예상 주차 요금은{" "}
            <span className="text-[24px] relative inline-block">
              <span className="relative z-10 mix-blend-multiply text-blue500">
                {parkingFee?.toLocaleString()}원
              </span>
              <span className="absolute -bottom-[0] left-0 h-[60%] bg-yellow-200 origin-left animate-marker" />
            </span>{" "}
            입니다
          </p>
          <button
            className="h-[36px] w-[115px] bg-lightBlueBackground text-lightBlueText border-lightBlueBorder text-[14px] border-2 rounded-[8px] transition-all duration-200 ease-in-out mb-[-32px]"
            onClick={() => setIsResultView(false)}
          >
            다시 조회하기
          </button>
        </div>
      )}
    </div>
  )
}
