"use client"

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
  const getColorByValue = (value: number) => {
    if (value <= 30) return "#16A34A"
    if (value <= 70) return "#FABE00"
    return "#EF0000"
  }

  const chartData = {
    labels: ["P1 여객주차장", "P2 여객주차장", "P3 여객(화물)"],
    datasets: [
      {
        label: "주차장 혼잡도",
        data: [80, 60, 30],
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
        parkingInfo: [
          { current: 200, total: 500 },
          { current: 300, total: 500 },
          { current: 70, total: 500 },
        ],
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
            return [`주차된 차량 수: ${parkingInfo.current}대`, `주차 가능 차량 수: ${parkingInfo.total}대`]
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
    <div className="col-span-12 xl:col-span-8 bg-white rounded-[8px] h-[260px] xl:w-[530px] w-[700px] p-6 relative">
      <h2 className="text-xl font-bold mb-2 text-[#000000] text-[20px]">공항 주차장 혼잡도</h2>
      <div className="text-[#7B7B7B] mb-2 mt-[-8px] text-[14px] flex items-center">
        <span className="text-[#215DCE] underline">P1 여객주차장</span>을 이용하는게 좋겠어요.
        <div className="flex items-center ml-20">
            <span className="w-3 h-3 rounded-full bg-[#16A34A]"></span>
          <span className="xl:text-xs text-sm ml-1">원활</span>
          <span className="w-3 h-3 rounded-full bg-[#FABE00] ml-4"></span>
          <span className="xl:text-xs text-sm ml-1">보통</span>
          <span className="w-3 h-3 rounded-full bg-[#EF0000] ml-4"></span>
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