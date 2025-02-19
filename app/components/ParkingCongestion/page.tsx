"use client"

import useSWR from "swr"
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

const fetcher = (url: string) => fetch(url).then(res => res.json())

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

const ParkingCongestion = () => {
  const { data, error } = useSWR(`${process.env.NEXT_PUBLIC_API_BASE_URL}/parking`, fetcher, {
    refreshInterval: 3000, 
  })

  if (!data) {
    return (
      <div className="col-span-12 xl:col-span-8 bg-white rounded-[8px] h-[250px] xl:h-[250px] w-full xl:w-[520px] p-4 xl:p-6 relative">
        <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
        <div className="flex flex-col xl:flex-row xl:items-center mb-2 space-y-2 xl:space-y-0">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="flex items-center xl:ml-20">
            <div className="w-3 h-3 rounded-full bg-gray-200"></div>
            <div className="w-8 h-3 bg-gray-200 rounded ml-1"></div>
            <div className="w-3 h-3 rounded-full bg-gray-200 ml-4"></div>
            <div className="w-8 h-3 bg-gray-200 rounded ml-1"></div>
            <div className="w-3 h-3 rounded-full bg-gray-200 ml-4"></div>
            <div className="w-8 h-3 bg-gray-200 rounded ml-1"></div>
          </div>
        </div>
        <div className="h-[200px] xl:h-[170px] w-full bg-gray-200 rounded"></div>
      </div>
    )
  }

  const maxRemainingLot = data.reduce((maxLot: any, lot: any) => 
    lot.remainingSpace > maxLot.remainingSpace ? lot : maxLot, data[0])

  const bestParkingName = maxRemainingLot.parkingAirportCodeName

  const parkingData = data.map((lot: any) => ({
    name: lot.parkingAirportCodeName,
    congestion: lot.parkingCongestionDegree === "100%" || lot.remainingSpace === 0 ? "만차" : getCongestionLabel(parseFloat(lot.parkingCongestionDegree)),
    degree: parseFloat(lot.parkingCongestionDegree),
    current: lot.parkingOccupiedSpace,
    total: lot.parkingTotalSpace,
    remaining: lot.remainingSpace,
  }))

  const chartData = {
    labels: parkingData.map((lot: { name: any }) => lot.name), 
    datasets: [
      {
        label: "주차장 혼잡도",
        data: parkingData.map((lot: { degree: any }) => lot.degree),
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
            return [
              `전체 주차면: ${parkingInfo.total}대`,
              `주차된 차량 수: ${parkingInfo.current}대`,
              `주차 가능 차량 수: ${parkingInfo.remaining}대`,
              `혼잡도: ${parkingInfo.congestion}`
            ]
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

  return (
<div className="col-span-12 xl:col-span-8 bg-white rounded-[8px] h-[300px] xl:h-[250px] w-full xl:w-[520px] p-4 xl:p-6 relative mt-1 md:mt-0">
  <h2 className="text-xl font-bold mt-[8px] mb-[8px] xl:mb-2 text-black text-[20px] ml-[10px] xl:ml-0">
    공항 주차장 혼잡도
  </h2>
  <div className="text-gray400 mb-2 mt-[-8px] text-[14px] flex flex-col xl:flex-row xl:items-center space-y-2 xl:space-y-0">
    <span className="ml-[10px] xl:ml-0">
      <span className="text-blue500 underline">{bestParkingName}</span>을 이용하는게 좋겠어요.
    </span>
    <div className="flex items-center ml-[10px] xl:ml-20">
      <span className="w-3 h-3 rounded-full bg-green500"></span>
      <span className="text-xs ml-1">원활</span>
      <span className="w-3 h-3 rounded-full bg-yellow300 ml-4"></span>
      <span className="text-xs ml-1">보통</span>
      <span className="w-3 h-3 rounded-full bg-red500 ml-4"></span>
      <span className="text-xs ml-1">혼잡</span>
    </div>
  </div>
  <div className="h-[180px] xl:h-[150px] w-full">
    <Line data={chartData} options={chartOptions} />
  </div>
</div>


  )
}

export default ParkingCongestion