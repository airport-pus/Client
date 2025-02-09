"use client";

import { useState } from "react";
import Image from "next/image";
import Footer from "./footer/page";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const [selected, setSelected] = useState<number>(1);

  const handleButtonClick = (index: number) => {
    setSelected(index);
  };

  const getColorByValue = (value: number) => {
    if (value <= 30) return '#16A34A';  
    if (value <= 70) return '#FABE00';  
    return '#EF0000'; 
  };

  const chartData = {
    labels: ['P1 여객주차장', 'P2 여객주차장', 'P3 여객(화물)'],
    datasets: [
      {
        label: '주차장 혼잡도',
        data: [40, 60, 14],
        borderColor: '#215DCE',
        backgroundColor: (context: any) => {
          const value = context.raw;
          return getColorByValue(value);
        },
        tension: 0,
        pointStyle: 'circle',
        pointRadius: 5,
        pointHoverRadius: 7,
        showLine: true,
        segment: {
          borderColor: '#215DCE'
        },
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        parkingInfo: [
          { current: 200, total: 500 },
          { current: 300, total: 500 },
          { current: 70, total: 500 },
        ]
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const dataIndex = context.dataIndex;
            const dataset = context.dataset;
            const parkingInfo = dataset.parkingInfo[dataIndex];
            return [
              `주차된 차량 수: ${parkingInfo.current}대`,
              `주차 가능 차량 수: ${parkingInfo.total}대`
            ];
          }
        }
      }
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
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-8 bg-[#F3F4F6] font-pretendard">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="col-span-12 flex items-center gap-4 mb-6">
            <Image src="/logo.svg" alt="PUSAN logo" width={100} height={100} />
            <div className="flex-grow">
              <h1 className="text-[24px] font-bold text-[#000000]">
                김해국제공항의 모든 정보를 한 곳에서,
              </h1>
              <p className="text-[16px] text-[#6B7280]">
                지금까지 <span className="text-[#215DCE] font-semibold">333</span>명이 페이지에 방문했어요.
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-[#606060] text-[14px] ml-4">데이터셋</div>
              <div className="text-[#606060] text-[14px] ml-4">문의하기</div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-5 mb-5">
            <div className="col-span-12 sm:col-span-8 bg-white rounded-[8px] h-[300px] sm:w-[530px] p-6 relative">
              <h2 className="text-xl font-bold mb-2 text-[#000000] text-[20px]">
                공항 주차장 혼잡도
              </h2>
              <p className="text-[#7B7B7B] mb-2 mt-[-8px] text-[14px] flex items-center">
                <span className="text-[#215DCE] underline">P1 여객주차장</span>을 이용하는게 좋겠어요.
                  <div className="flex items-center ml-20">
                    <span className="w-3 h-3 rounded-full bg-[#16A34A]"></span> 
                    <span className="text-sm ml-1">원활</span>
                    <span className="w-3 h-3 rounded-full bg-[#FABE00] ml-4"></span> 
                    <span className="text-sm ml-1">보통</span>
                    <span className="w-3 h-3 rounded-full bg-[#EF0000] ml-4"></span> 
                    <span className="text-sm ml-1">혼잡</span>
                </div>
              </p>
              
              <div className="h-[200px] w-full">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-5 mb-5 bg-[#CDD4E5] rounded-lg p-2">
            <button
              className={`col-span-4 py-2 px-4 rounded-[8px] text-[16px] transition-colors ${
                selected === 1 ? "bg-white text-[#2A5FEC] font-[600]" : "text-[#7B7B7B]"
              }`}
              onClick={() => handleButtonClick(1)}
            >
              실시간 구간별 혼잡도
            </button>
            <button
              className={`col-span-4 py-2 px-4 rounded-[8px] text-[16px] transition-colors ${
                selected === 2 ? "bg-white text-[#2A5FEC] font-[600]" : "text-[#7B7B7B]"
              }`}
              onClick={() => handleButtonClick(2)}
            >
              실시간 출발 주기장 정보
            </button>
            <button
              className={`col-span-4 py-2 px-4 rounded-[8px] text-[16px] transition-colors ${
                selected === 3 ? "bg-white text-[#2A5FEC] font-[600]" : "text-[#7B7B7B]"
              }`}
              onClick={() => handleButtonClick(3)}
            >
              실시간 도착 주기장 정보
            </button>
          </div>

          <div className="col-span-12 bg-white rounded-lg p-4 min-h-[400px]"></div>
        </div>
      </main>
      <Footer className="mt-auto" />
    </div>
  );
}
