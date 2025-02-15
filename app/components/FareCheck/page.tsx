"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

type ParkingLot = 'P1P2' | 'P3'
type VehicleSize = 'small' | 'large'
type DiscountType = 'normal' | 'compact' | 'eco12' | 'eco3' | 'disabled' | 'children' | 'veteran'

interface ParkingFeeRequest {
  holidayMinutes: number
  weekdayMinutes: number
  parkingLot: string
  isLargeCar: boolean
  discountType: number
}

interface TimeRange {
  weekdayMinutes: number
  holidayMinutes: number
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
]

const DISCOUNT_TYPE_MAP: Record<DiscountType, number> = {
  'normal': 0,
  'compact': 1,
  'eco12': 2,
  'eco3': 3,
  'disabled': 4,
  'children': 5,
  'veteran': 6
}

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2).toString().padStart(2, "0")
  const minute = i % 2 === 0 ? "00" : "30"
  return `${hour}:${minute}`
})

const formatDate = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const isHoliday = (date: Date): boolean => {
  const isWeekend = date.getDay() === 0 || date.getDay() === 6
  return isWeekend || HOLIDAYS_2024.includes(formatDate(date))
}

const calculateTimeRange = (
  startDate: string,
  startTime: string,
  endDate: string,
  endTime: string
): TimeRange => {
  const startDateTime = new Date(`${startDate}T${startTime}`)
  const endDateTime = new Date(`${endDate}T${endTime}`)

  if (endDateTime <= startDateTime) {
    return { weekdayMinutes: 0, holidayMinutes: 0 }
  }

  let currentDate = new Date(startDateTime)
  let weekdayMinutes = 0
  let holidayMinutes = 0

  while (currentDate < endDateTime) {
    if (isHoliday(currentDate)) {
      holidayMinutes++
    } else {
      weekdayMinutes++
    }
    currentDate.setMinutes(currentDate.getMinutes() + 1)
  }

  return { weekdayMinutes, holidayMinutes }
}

const createParkingFeeRequest = (
  timeRange: TimeRange,
  parkingLot: ParkingLot,
  vehicleSize: VehicleSize,
  discountType: DiscountType
): ParkingFeeRequest => ({
  holidayMinutes: timeRange.weekdayMinutes,
  weekdayMinutes: timeRange.holidayMinutes,
  parkingLot: parkingLot === "P1P2" ? "P1" : "P3",
  isLargeCar: vehicleSize === "large",
  discountType: DISCOUNT_TYPE_MAP[discountType]
})

export default function ParkingFeeCalculator() {
  const [dates, setDates] = useState({
    startDate: "2023-03-13",
    startTime: "00:00",
    endDate: "2023-03-13",
    endTime: "00:00"
  })
  const [parkingOptions, setParkingOptions] = useState({
    parkingLot: "P1P2" as ParkingLot,
    vehicleSize: "small" as VehicleSize,
    discountType: "normal" as DiscountType
  })
  const [result, setResult] = useState({
    fee: null as number | null,
    isVisible: false
  })

  useEffect(() => {
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - 7)

    setDates(prev => ({
      ...prev,
      startDate: formatDate(startDate),
      endDate: formatDate(today)
    }))
  }, [])

  const handleDateChange = (field: keyof typeof dates) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setDates(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleOptionChange = (field: keyof typeof parkingOptions) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setParkingOptions(prev => ({ ...prev, [field]: e.target.value }))
  }

  const calculateParkingFee = async () => {
    try {
      const startDateTime = new Date(`${dates.startDate}T${dates.startTime}`)
      const endDateTime = new Date(`${dates.endDate}T${dates.endTime}`)
      
      if (endDateTime <= startDateTime) {
        alert('출차 시간은 입차 시간보다 늦어야 합니다.')
        return
      }

      const timeRange = calculateTimeRange(
        dates.startDate,
        dates.startTime,
        dates.endDate,
        dates.endTime
      )

      const request = createParkingFeeRequest(
        timeRange,
        parkingOptions.parkingLot,
        parkingOptions.vehicleSize,
        parkingOptions.discountType
      )

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/parking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`Failed to calculate parking fee: ${response.status}`)
      }

      const fee = Number(await response.text())
      setResult({ fee, isVisible: true })
    } catch (error) {
      console.error('Error calculating parking fee:', error)
      alert('주차 요금 계산 중 오류가 발생했습니다.')
    }
  }

  const renderParkingOptions = () => (
    <div className="flex mb-4 mt-[20px]">
      <div className="flex-1">
        <span className="text-sm font-semibold text-gray600">주차장 선택</span>
        <div className="flex items-center mt-2">
          {[
            { value: "P1P2", label: "P1·P2 주차장" },
            { value: "P3", label: "P3 (화물)" }
          ].map(({ value, label }) => (
            <label key={value} className="flex items-center mr-4 cursor-pointer">
              <input
                type="radio"
                name="parking"
                checked={parkingOptions.parkingLot === value}
                onChange={handleOptionChange('parkingLot')}
                value={value}
                className="mr-2"
              />
              <span className={parkingOptions.parkingLot === value ? "font-medium text-black" : "text-gray575"}>
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4 ml-[40px]">
        <span className="text-sm font-semibold text-gray600">차량 크기 선택</span>
        <div className="flex items-center mt-2">
          {[
            { value: "small", label: "소형" },
            { value: "large", label: "대형" }
          ].map(({ value, label }) => (
            <label key={value} className="flex items-center mr-4 cursor-pointer">
              <input
                type="radio"
                name="size"
                checked={parkingOptions.vehicleSize === value}
                onChange={handleOptionChange('vehicleSize')}
                value={value}
                className="mr-2"
              />
              <span className={parkingOptions.vehicleSize === value ? "font-medium text-black" : "text-gray575"}>
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4 mt-[-3px] ml-[120px]">
        <span className="text-sm font-semibold text-gray600 ml-[-40px]">할인</span>
        <div className="flex items-center mt-[2]">
          <select
            className="border px-3 py-1 rounded-md text-gray500 bg-blue100 border-blue200 appearance-none"
            value={parkingOptions.discountType}
            onChange={handleOptionChange('discountType')}
            style={{ transform: 'translateX(-40px) translateY(3px)' }}
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
  )

  const renderTimeSelection = () => (
    <div className="mb-4 mt-[-8px] flex items-center">
      <div className="flex-1">
        <span className="text-sm font-semibold text-gray600">입·출차 시간 선택</span>
        <div className="flex items-center mt-2">
          <input
            type="date"
            className="border px-2 py-1 rounded-md mr-2 text-gray500 bg-blue100 border-blue200"
            value={dates.startDate}
            onChange={handleDateChange('startDate')}
          />
          <select
            className="border px-2 py-1 rounded-md mr-4 text-gray500 bg-blue100 border-blue200 appearance-none"
            style={{ WebkitAppearance: "none", MozAppearance: "none" }}
            value={dates.startTime}
            onChange={handleDateChange('startTime')}
          >
            {TIME_OPTIONS.map((time) => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
          <span className="text-gray500">~</span>
          <input
            type="date"
            className="border px-2 py-1 rounded-md ml-4 mr-2 text-gray500 bg-blue100 border-blue200"
            value={dates.endDate}
            onChange={handleDateChange('endDate')}
          />
          <select
            className="border px-2 py-1 rounded-md text-gray500 bg-blue100 border-blue200 appearance-none"
            style={{ WebkitAppearance: "none", MozAppearance: "none" }}
            value={dates.endTime}
            onChange={handleDateChange('endTime')}
          >
            {TIME_OPTIONS.map((time) => (
              <option key={time} value={time}>{time}</option>
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
  )

  const renderResult = () => (
    <div className="flex items-center flex-col justify-center h-full gap-1">
      <Image src="/Payment.svg" alt="payment" width={180} height={50} />
      <p className="text-[20px] font-bold text-black mb-4 mt-2">
        예상 주차 요금은{" "}
        <span className="text-[24px] relative inline-block">
          <span className="relative z-10 mix-blend-multiply text-blue500">
            {result.fee?.toLocaleString()}원
          </span>
          <span className="absolute -bottom-[0] left-0 h-[60%] bg-yellow-200 origin-left animate-marker" />
        </span>{" "}
        입니다
      </p>
      <button
        className="h-[36px] w-[115px] bg-lightBlueBackground text-lightBlueText border-lightBlueBorder text-[14px] border-2 rounded-[8px] transition-all duration-200 ease-in-out mb-[-32px]"
        onClick={() => setResult(prev => ({ ...prev, isVisible: false }))}
      >
        다시 조회하기
      </button>
    </div>
  )

  return (
    <div className="col-span-12 sm:col-span-4 bg-white rounded-[8px] h-[260px] p-6 relative w-[700px] absolute xl:left-[-300px]">
      {!result.isVisible ? (
        <>
          <h2 className="text-xl font-bold mb-4 text-black">
            예상 주차요금 조회
          </h2>
          {renderParkingOptions()}
          {renderTimeSelection()}
        </>
      ) : renderResult()}
    </div>
  )
}