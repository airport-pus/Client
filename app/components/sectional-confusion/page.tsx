'use client';

import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Image from 'next/image';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type DateType = "어제" | "오늘";

type StatusData = {
  [key in DateType]: {
    [key: string]: number[];
  };
};

type SectionStatus = {
  section: string;
  status: string;
  statusColor: string;
};

const TrafficStatus = () => {
  const message = "실시간 공항 구간별 혼잡도 확인";
  const [selectedSection, setSelectedSection] = useState("1구간");
  const [selectedDate, setSelectedDate] = useState<DateType>("오늘");

  const sectionStatuses: SectionStatus[] = [
    { section: "1구간", status: "원활", statusColor: "bg-[#E2FFEB] text-[#16A34A]" },
    { section: "2구간", status: "보통", statusColor: "bg-[#FFFBD8] text-[#CA8A04]" },
    { section: "3구간", status: "혼잡", statusColor: "bg-[#FFECEC] text-[#FF0000]" },
    { section: "전체 구간", status: "매우혼잡", statusColor: "bg-[#FFECEC] text-[#FF0000]" }
  ];

  const statusData: StatusData = {
    어제: {
      "1구간": [1, 2, 2, 3, 2, 1, 1, 2, 3, 4, 3, 2, 2, 1, 2, 3, 3, 4, 4, 3, 3, 2, 1, 1],
      "2구간": [2, 2, 3, 3, 4, 4, 3, 2, 3, 3, 2, 2, 3, 4, 3, 3, 2, 3, 4, 4, 3, 2, 2, 2],
      "3구간": [3, 3, 3, 4, 4, 4, 4, 3, 3, 4, 3, 3, 4, 4, 3, 4, 4, 4, 3, 3, 2, 2, 3, 3],
      "전체 구간": [4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 4, 4, 4, 3, 4, 4, 4, 3, 3, 3, 2, 2],
    },
    오늘: {
      "1구간": [1, 1, 2, 3, 3, 2, 1, 2, 2, 3, 3, 4, 4, 3, 2, 2, 1, 1, 2, 3, 3, 2, 2, 2],
      "2구간": [2, 2, 3, 3, 3, 3, 3, 2, 3, 3, 2, 2, 3, 3, 2, 3, 2, 3, 3, 4, 3, 2, 2, 2],
      "3구간": [3, 3, 4, 4, 4, 4, 3, 4, 4, 4, 3, 3, 3, 4, 3, 4, 3, 3, 3, 2, 3, 3, 3, 3],
      "전체 구간": [4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3, 4, 3, 3, 4, 4, 3, 3, 4, 4, 4],
    }
  };

  const sizeClass = "px-2 py-1 text-[12px] rounded-md";
  
  const labels = Array.from({ length: 24 }, (_, index) => `${String(index).padStart(2, '0')}~${String(index + 1).padStart(2, '0')}시`);

  const yLabels = ["원활", "보통", "혼잡", "매우혼잡"];

  const getStatusText = (value: number) => {
    return yLabels[value - 1] || '';
  };

  const selectedData = statusData[selectedDate][selectedSection];

  const chartData = {
    labels,
    datasets: [
      {
        label: `${selectedSection} 시간별 혼잡도`,
        data: selectedData || [],
        borderColor: "#215DCE",
        backgroundColor: "rgba(33, 93, 206, 0.2)",
        borderWidth: 2,
        pointRadius: 6,
        pointBackgroundColor: "#215DCE",
        pointBorderColor: "#FFFFFF",
        pointBorderWidth: 2,
        tension: 0.4, 
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 11
          }
        },
        grid: { display: false }
      },
      y: {
        ticks: {
          callback: function (tickValue: string | number) {
            return yLabels[Number(tickValue) - 1];
          },
          stepSize: 1,
          min: 1,
          max: 4
        },
        grid: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)',
          borderDash: [5, 5],
          lineWidth: 1
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            return `혼잡도: ${getStatusText(value)}`;
          }
        }
      }
    }
  };

  return (
    <div className="relative flex">
      <div>
        <div className="mb-2 w-[460px] text-[22px] text-black font-bold mt-2 ml-2 mb-[-3]">
          {message}
        </div>
        <div className="mb-4 w-[480px] text-[14px] text-gray400 ml-2">
          표에서 셀을 클릭하면 시간별 그래프를 보실 수 있습니다.
        </div>
        <div className="w-[420px] ml-2">
          <div className="bg-blue500 text-white p-3 rounded-t-lg grid grid-cols-2 text-center mt-[6]">
            <div className="font-medium">구간</div>
            <div className="font-medium">혼잡도</div>
          </div>
          <div className="border border-gray-200 rounded-b-lg">
            {sectionStatuses.map((sectionStatus, index) => (
              <div key={index} onClick={() => setSelectedSection(sectionStatus.section)}
                className="grid grid-cols-2 p-4 border-b last:border-b-0 text-center hover:bg-[#F3F3F3] transition-colors duration-200 cursor-pointer">
                <div className="font-medium text-[#000000]">{sectionStatus.section}</div>
                <div>
                  <span className={`${sizeClass} ${sectionStatus.statusColor}`}>
                    {sectionStatus.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="ml-4 w-[670px] h-[324px] p-4 mt-14">
      <div className="mb-2 text-[22px] text-[#000000] font-bold ml-2 mt-[-68] mb-[32] flex justify-between items-center">
          <div>{`${selectedSection} 혼잡도 그래프`}</div>
          <div className="flex items-center">
            <button 
              onClick={() => setSelectedDate("어제")}
              className={`px-4 py-2 text-[14px] font-medium border ${
                selectedDate === "어제" 
                  ? 'bg-blue100 text-gray500 border-blue300' 
                  : 'bg-[#F2F2F2] text-gray700 border-grayBorder'
              } rounded-md flex items-center mr-2`}>
              어제
              <Image 
                src="/date.svg" 
                width={16} 
                height={16} 
                alt="date" 
                className={`ml-2 ${selectedDate === "어제" ? 'text-[#4F5561]' : 'text-[#7A7A7A]'}`}
              />
            </button>
            <button 
              onClick={() => setSelectedDate("오늘")}
              className={`px-4 py-2 text-[14px] font-medium border ${selectedDate === "오늘" ? 'bg-[#EFF6FF] text-[#4F5561] border-[#BFDBFE]' : 'bg-[#F2F2F2] text-[#7A7A7A] border-[#D1D5DB]'} rounded-md flex items-center`}>
              오늘
              <Image 
                src="/date.svg" 
                width={16} 
                height={16} 
                alt="date" 
                className={`ml-2 ${selectedDate === "오늘" ? 'text-[#4F5561]' : 'text-[#7A7A7A]'}`}
              />
            </button>
          </div>
        </div>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TrafficStatus;
