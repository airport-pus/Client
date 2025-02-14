"use client"

import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const ParkingCongestion = () => {
  const [parkingData, setParkingData] = useState<{ name: string; congestion: string; degree: number; current: number; total: number; remaining: number }[]>([])
  const [bestParkingName, setBestParkingName] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchParkingData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/parking`)
        const data = await response.json()
        const maxRemainingLot = data.reduce((maxLot: any, lot: any) => 
          lot.remainingSpace > maxLot.remainingSpace ? lot : maxLot, data[0])

        setBestParkingName(maxRemainingLot.parkingAirportCodeName)
        
        setParkingData(
          data.map((lot: any) => ({
            name: lot.parkingAirportCodeName,
            congestion: lot.parkingCongestionDegree === "100%" || lot.remainingSpace === 0 ? "만차" : getCongestionLabel(parseFloat(lot.parkingCongestionDegree)),
            degree: parseFloat(lot.parkingCongestionDegree),
            current: lot.parkingOccupiedSpace,
            total: lot.parkingTotalSpace,
            remaining: lot.remainingSpace,
          }))
        )
      } catch (error) {
        console.error("Failed to fetch parking data", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchParkingData()
  }, [])

  const getColorByValue = (value: number) => {
    if (value <= 30) return "#16A34A"
    if (value <= 70) return "#FABE00"
    return "#EF0000"
  }

  const getCongestionLabel = (value: number) => {
    if (value <= 30) return "원활"
    if (value <= 70) return "보통"
    return "혼잡"
  }

  const chartData = {
    labels: parkingData.map((lot) => lot.name), 
    datasets: [
      {
        label: "주차장 혼잡도",
        data: parkingData.map((lot) => lot.degree),
        borderColor: "#215DCE",
        backgroundColor: (context: any) => {
          const value = context.raw
          return getColorByValue(value)
        },
        tension: 0,
        pointStyle: "circle",
        pointRadius: 5,
        pointHoverRadius: 7,
        showLine: true,
        segment: {
          borderColor: "#215DCE",
        },
        pointBorderColor: "#FFFFFF",
        pointBorderWidth: 2,
        parkingInfo: parkingData,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const dataIndex = context.dataIndex
            const dataset = context.dataset
            const parkingInfo = dataset.parkingInfo[dataIndex]
            return [`전체 주차면: ${parkingInfo.total}대`, `주차된 차량 수: ${parkingInfo.current}대`, `주차 가능 차량 수: ${parkingInfo.remaining}대`, `혼잡도: ${parkingInfo.congestion}`]
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 10,
        },
      },
    },
  }

  if (isLoading) {
    return (
      <div className="col-span-12 xl:col-span-8 bg-white rounded-[8px] h-[260px] xl:w-[530px] w-[700px] p-6 relative animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="flex items-center mb-2">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="flex items-center ml-20">
            <div className="w-3 h-3 rounded-full bg-gray-200"></div>
            <div className="w-8 h-3 bg-gray-200 rounded ml-1"></div>
            <div className="w-3 h-3 rounded-full bg-gray-200 ml-4"></div>
            <div className="w-8 h-3 bg-gray-200 rounded ml-1"></div>
            <div className="w-3 h-3 rounded-full bg-gray-200 ml-4"></div>
            <div className="w-8 h-3 bg-gray-200 rounded ml-1"></div>
          </div>
        </div>
        <div className="h-[170px] w-full bg-gray-200 rounded"></div>
      </div>
    )
  }

  return (
    <div className="col-span-12 xl:col-span-8 bg-white rounded-[8px] h-[260px] xl:w-[530px] w-[700px] p-6 relative">
      <h2 className="text-xl font-bold mb-2 text-black text-[20px]">공항 주차장 혼잡도</h2>
      <div className="text-gray400 mb-2 mt-[-8px] text-[14px] flex items-center">
        <span className="text-blue500 underline">{bestParkingName}</span>을 이용하는게 좋겠어요.
        <div className="flex items-center ml-20">
          <span className="w-3 h-3 rounded-full bg-green500"></span>
          <span className="xl:text-xs text-sm ml-1">원활</span>
          <span className="w-3 h-3 rounded-full bg-yellow300 ml-4"></span>
          <span className="xl:text-xs text-sm ml-1">보통</span>
          <span className="w-3 h-3 rounded-full bg-red500 ml-4"></span>
          <span className="xl:text-xs text-sm ml-1">혼잡</span>
        </div>
      </div>
      <div className="h-[170px] w-full">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}

export default ParkingCongestion