"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { formatDate, TIME_OPTIONS, calculateTimeRange, createParkingFeeRequest } from "@/utils"
import { ParkingOptionsProps } from "@/types/ParkingOptionsProps"
import { ParkingFormProps } from "@/types/ParkingFormProps"
import { ResultViewProps } from "@/types/ResultViewProps"
import { ParkingLot } from "@/types/ParkingLot"
import { VehicleSize } from "@/types/VehicleSize"
import { DiscountType } from "@/types/DiscountType"

function ParkingOptions({ parkingOptions, onOptionChange }: ParkingOptionsProps) {
  return (
    <div className="flex mb-4 mt-[20px] flex-col xl:flex-row">
      <div className="flex-1 order-1">
        <span className="text-sm font-semibold text-gray600 whitespace-nowrap">주차장 선택</span>
        <div className="flex items-center mt-2">
          {[
            { value: "P1P2", label: "P1·P2 주차장" },
            { value: "P3", label: "P3 (화물)" }
          ].map(({ value, label }) => (
            <label key={value} className="flex items-center mr-4 cursor-pointer whitespace-nowrap">
              <input
                type="radio"
                name="parking"
                checked={parkingOptions.parkingLot === value}
                onChange={onOptionChange("parkingLot")}
                value={value}
                className="mr-2"
              />
              <span className={parkingOptions.parkingLot === value ? "font-medium text-black whitespace-nowrap" : "text-gray575 whitespace-nowrap"}>
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div className="mb-4 order-2 ml-420px] mt-[30px] xl:ml-0 xl:mt-0">
        <span className="text-sm font-semibold text-gray600 whitespace-nowrap">차량 크기 선택</span>
        <div className="flex items-center mt-[8px]">
          {[
            { value: "small", label: "소형" },
            { value: "large", label: "대형" }
          ].map(({ value, label }) => (
            <label key={value} className="flex items-center mr-4 cursor-pointer whitespace-nowrap">
              <input
                type="radio"
                name="size"
                checked={parkingOptions.vehicleSize === value}
                onChange={onOptionChange("vehicleSize")}
                value={value}
                className="mr-2"
              />
              <span className={parkingOptions.vehicleSize === value ? "font-medium text-black whitespace-nowrap" : "text-gray575 whitespace-nowrap"}>
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div className="mb-4 mt-[-3px] ml-[120px] order-3 hidden xl:block">
        <span className="text-sm font-semibold text-gray600 ml-[-40px] whitespace-nowrap">할인</span>
        <div className="flex items-center mt-[2]">
          <select
            className="border px-3 py-1 rounded-md text-gray500 bg-blue100 border-blue200 appearance-none"
            value={parkingOptions.discountType}
            onChange={onOptionChange("discountType")}
            style={{ transform: "translateX(-40px) translateY(3px)" }}
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
}


function ParkingForm({ dates, parkingOptions, onOptionChange, onDateChange, onCalculate }: ParkingFormProps) {
  return (
    <>
      <h2 className="text-xl font-bold mb-4 text-black">예상 주차요금 조회</h2>
      <ParkingOptions parkingOptions={parkingOptions} onOptionChange={onOptionChange} />
      <div className="mb-4 xl:hidden order-3">
        <span className="text-sm font-semibold text-gray600 whitespace-nowrap">할인</span>
        <div className="flex items-center mt-2">
          <select
            className="border px-3 py-1 rounded-md text-gray500 bg-blue100 border-blue200 appearance-none"
            value={parkingOptions.discountType}
            onChange={onOptionChange("discountType")}
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
      <div className="mb-4 mt-8 flex flex-col xl:flex-row xl:items-center xl:-translate-y-5 order-4">
        <div className="flex-1">
          <span className="text-sm font-semibold text-gray600 block">입·출차 시간 선택</span>
          <div className="mt-2 flex flex-col xl:flex-row xl:items-center">
            <div className="flex items-center">
              <input
                type="date"
                className="border px-2 py-1 rounded-md mr-2 text-gray500 bg-blue100 border-blue200"
                value={dates.startDate}
                onChange={onDateChange("startDate")}
              />
              <select
                className="border px-2 py-1 rounded-md text-gray500 bg-blue100 border-blue200 appearance-none"
                value={dates.startTime}
                onChange={onDateChange("startTime")}
              >
                {TIME_OPTIONS.map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center mt-2 xl:mt-0 xl:ml-4">
              <input
                type="date"
                className="border px-2 py-1 rounded-md mr-2 text-gray500 bg-blue100 border-blue200"
                value={dates.endDate}
                onChange={onDateChange("endDate")}
              />
              <select
                className="border px-2 py-1 rounded-md text-gray500 bg-blue100 border-blue200 appearance-none"
                value={dates.endTime}
                onChange={onDateChange("endTime")}
              >
                {TIME_OPTIONS.map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <button
          className="h-[36px] w-[96px] bg-blue500 text-white px-2 rounded-[8px] mt-10 xl:mt-8 xl:ml-2 transition-all duration-200 ease-in-out xl:translate-x-[-36px] order-5"
          onClick={onCalculate}
        >
          🚗 조회
        </button>
      </div>
    </>
  )
}

function ResultView({ fee, onReset }: ResultViewProps) {
  return (
    <div className="flex items-center flex-col justify-center h-[220px] gap-1">
      <Image src="/Payment.svg" alt="payment" width={180} height={50} />
      <p className="text-[20px] font-bold text-black mb-4 mt-2">
        예상 주차 요금은{" "}
        <span className="text-[24px] relative inline-block">
          <span className="relative z-10 mix-blend-multiply text-blue500">
            {fee.toLocaleString()}원
          </span>
          <span className="absolute -bottom-[0] left-0 h-[60%] bg-yellow-200 origin-left animate-marker" />
        </span>{" "}
        입니다
      </p>
      <button
        className="h-[36px] w-[115px] bg-lightBlueBackground text-lightBlueText border-lightBlueBorder text-[14px] border-2 rounded-[8px] transition-all duration-200 ease-in-out mb-[-32px]"
        onClick={onReset}
      >
        다시 조회하기
      </button>
    </div>
  )
}

function FormSkeleton() {
  return (
    <div className="flex flex-col justify-center items-start h-full animate-pulse">
      <div className="bg-gray-300 h-8 w-56 mb-6 rounded"></div>
      <div className="w-full space-y-4">
        <div className="bg-gray-300 h-10 w-full rounded"></div>
        <div className="bg-gray-300 h-10 w-full rounded"></div>
        <div className="bg-gray-300 h-10 w-full rounded"></div>
      </div>
    </div>
  )
}

function ResultSkeleton() {
  return (
    <div className="flex items-center flex-col justify-center h-full gap-1 animate-pulse">
      <div className="bg-gray-300 w-[180px] h-[50px] mb-4 rounded-md"></div>
      <div className="bg-gray-300 w-[240px] h-[24px] mb-4 rounded-md"></div>
      <div className="bg-gray-300 w-[115px] h-[36px] rounded-md"></div>
    </div>
  )
}


export default function ParkingFeeCalculator() {
  const [holidays, setHolidays] = useState<string[]>([])
  const [holidayLoading, setHolidayLoading] = useState(true)

  useEffect(() => {
    async function fetchHolidays() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/holiday`)
        if (!response.ok) {
          throw new Error(`${response.status}`)
        }
        const data = await response.json()
        const holidayDates = data.map((item: { holiday: string }) => {
          const s = item.holiday
          return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`
        })
        setHolidays(holidayDates)
      } catch (error) {
        console.error("Error fetching holidays:", error)
      } finally {
        setHolidayLoading(false)
      }
    }
    fetchHolidays()
  }, [])

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
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - 7)
    setDates(prev => ({
      ...prev,
      startDate: formatDate(startDate),
      endDate: formatDate(today)
    }))
    const timer = setTimeout(() => {
      setInitialLoading(false)
    }, 550)
    return () => clearTimeout(timer)
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
    if (holidayLoading) {
      alert("국경일 데이터가 아직 로딩 중입니다. 잠시 후 다시 시도해주세요.")
      return
    }
    const startDateTime = new Date(`${dates.startDate}T${dates.startTime}`)
    const endDateTime = new Date(`${dates.endDate}T${dates.endTime}`)
    if (endDateTime <= startDateTime) {
      alert("출차 시간은 입차 시간보다 늦어야 합니다.")
      return
    }
    setLoading(true)
    const timeRange = calculateTimeRange(
      dates.startDate,
      dates.startTime,
      dates.endDate,
      dates.endTime,
      holidays
    )
    const request = createParkingFeeRequest(
      timeRange,
      parkingOptions.parkingLot,
      parkingOptions.vehicleSize,
      parkingOptions.discountType
    )
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/parking`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request)
      })
      if (!response.ok) {
        throw new Error(`Failed to calculate parking fee: ${response.status}`)
      }
      const fee = Number(await response.text())
      setResult({ fee, isVisible: true })
    } catch (error) {
      console.error("Error calculating parking fee:", error)
      alert("주차 요금 계산 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const resetResult = () => {
    setResult({ fee: null, isVisible: false })
  }

  return (
    <div className="col-span-12 xl:col-span-4 bg-white rounded-[8px] h-auto xl:h-[250px] p-6 relative xl:w-[700px] xl:left-[-300px]">
      {initialLoading ? (
        <FormSkeleton />
      ) : loading ? (
        <ResultSkeleton />
      ) : !result.isVisible ? (
        <ParkingForm
          dates={dates}
          parkingOptions={parkingOptions}
          onOptionChange={handleOptionChange}
          onDateChange={handleDateChange}
          onCalculate={calculateParkingFee}
        />
      ) : (
        <ResultView fee={result.fee!} onReset={resetResult} />
      )}
    </div>
  )
}
