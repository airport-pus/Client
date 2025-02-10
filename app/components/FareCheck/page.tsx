"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

interface ParkingFeeCalculatorProps {
  className?: string;
}

export default function ParkingFeeCalculator({ className }: ParkingFeeCalculatorProps) {
  const [startDate, setStartDate] = useState("2023-03-13")
  const [startTime, setStartTime] = useState("00:00")
  const [endDate, setEndDate] = useState("2023-03-13")
  const [endTime, setEndTime] = useState("00:00")
  const [selectedParking, setSelectedParking] = useState("P1P2")
  const [selectedSize, setSelectedSize] = useState("small")
  const [selectedDiscount, setSelectedDiscount] = useState("normal")

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

  return (
    <div className={`col-span-12 sm:col-span-4 bg-white rounded-[8px] h-[300px] p-6 relative w-[700px] absolute xl:left-[-300px] ${className}`}>
      <h2 className="text-xl font-bold mb-4 text-[#000000]">예상 주차요금 조회</h2>

      <div className="flex mb-4">
        <div className="flex-1">
          <span className="text-sm font-semibold text-[#6B7280]">주차장 선택</span>
          <div className="flex items-center mt-2 ml-0.4">
            <label className="flex items-center mr-4 cursor-pointer">
              <input
                type="radio"
                name="parking"
                checked={selectedParking === "P1P2"}
                onChange={() => setSelectedParking("P1P2")}
                className="mr-2"
              />
              <span className={`${selectedParking === "P1P2" ? "text-sm font-medium text-black" : "text-[#757575]"}`}>
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
              <span className={`${selectedParking === "P3" ? "text-sm font-medium text-black" : "text-[#757575]"}`}>
                P3 (화물)
              </span>
            </label>
          </div>
        </div>

        <div className="mb-4 ml-[40px]">
          <span className="text-sm font-semibold text-[#6B7280]">차량 크기 선택</span>
          <div className="flex items-center mt-2 ml-04">
            <label className="flex items-center mr-4 cursor-pointer">
              <input
                type="radio"
                name="size"
                checked={selectedSize === "small"}
                onChange={() => setSelectedSize("small")}
                className="mr-2"
              />
              <span className={`${selectedSize === "small" ? "font-medium text-black" : "text-[#757575]"}`}>
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
              <span className={`${selectedSize === "large" ? "font-medium text-black" : "text-[#757575]"}`}>
                대형
              </span>
            </label>
          </div>
        </div>
        
        <div className="mb-4 mt-[-3px] ml-[120px]">
          <span className="text-sm font-semibold text-[#6B7280] ml-[-40px]">할인</span>
          <div className="flex items-center mt-[2]">
            <select
              className="border px-3 py-1 rounded-md text-[#4F5561] bg-[#EFF6FF] border-[#BFDBFE] appearance-none"
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

      <div className="mb-4 mt-[-10px]">
        <span className="text-sm font-semibold text-[#6B7280]">입·출차 시간 선택</span>
        <div className="flex items-center mt-2">
          <input
            type="date"
            className="border px-3 py-1 rounded-md mr-2 text-[#4F5561] bg-[#EFF6FF] border-[#BFDBFE]"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <select
            className="border px-3 py-1 rounded-md mr-4 text-[#4F5561] bg-[#EFF6FF] border-[#BFDBFE] appearance-none"
            style={{ WebkitAppearance: "none", MozAppearance: "none" }}
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          >
            {Array.from({ length: 48 }, (_, i) => {
              const hour = Math.floor(i / 2)
                .toString()
                .padStart(2, "0")
              const minute = i % 2 === 0 ? "00" : "30"
              return `${hour}:${minute}`
            }).map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
          <span className="text-[#4F5561]">~</span>
          <input
            type="date"
            className="border px-3 py-1 rounded-md ml-4 mr-2 text-[#4F5561] bg-[#EFF6FF] border-[#BFDBFE]"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <select
            className="border px-3 py-1 rounded-md text-[#4F5561] bg-[#EFF6FF] border-[#BFDBFE] appearance-none"
            style={{ WebkitAppearance: "none", MozAppearance: "none" }}
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          >
            {Array.from({ length: 48 }, (_, i) => {
              const hour = Math.floor(i / 2)
                .toString()
                .padStart(2, "0")
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

      <div className="absolute bottom-4 right-4 flex items-center space-x-2">
        <button className="w-[240px] h-[42px] bg-[#215DCE] text-white flex items-center justify-between px-3 rounded-[8px]">
          <span>🚗  주차요금 조회하기</span>
          <Image src="/right-arrow.svg" alt="Right Arrow" width={10} height={12} className="ml-2" />
        </button>
      </div>
    </div>
  )
}