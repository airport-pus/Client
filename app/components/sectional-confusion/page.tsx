'use client';

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
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

interface ApiResponse {
  cgdrAllLvl: number;
  cgdrALvl: number;
  cgdrBLvl: number;
  cgdrCLvl: number;
}

const TrafficStatus = () => {
  const message = "실시간 공항 구간별 혼잡도 확인";
  const [selectedSection, setSelectedSection] = useState("1구간");
  const [selectedDate, setSelectedDate] = useState<DateType>("오늘");
  const [apiData, setApiData] = useState<ApiResponse | null>(null);

  // API 호출 (NEXT_PUBLIC_API_BASE_URL/env에 설정되어 있음)
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/congestions/real`)
      .then((res) => res.json())
      .then((data: ApiResponse) => {
        setApiData(data);
      })
      .catch((error) => {
        console.error("Error fetching congestion data:", error);
      });
  }, []);

  // 상태값에 따른 텍스트와 색상 매핑
  const statusMap: { [key: number]: { text: string; color: string } } = {
    1: { text: "원활", color: "bg-green100 text-green500" },
    2: { text: "보통", color: "bg-yellow100 text-yellow500" },
    3: { text: "혼잡", color: "bg-red100 text-red500" },
    4: { text: "매우혼잡", color: "bg-red100 text-red500" },
  };

  // API 데이터가 있으면 해당 값으로, 없으면 기본값으로 표를 구성 (순서: 1구간, 2구간, 3구간, 전체 구간)
  const sectionStatuses: SectionStatus[] = apiData
    ? [
        {
          section: "1구간",
          status: statusMap[apiData.cgdrALvl]?.text || "",
          statusColor: statusMap[apiData.cgdrALvl]?.color || "",
        },
        {
          section: "2구간",
          status: statusMap[apiData.cgdrBLvl]?.text || "",
          statusColor: statusMap[apiData.cgdrBLvl]?.color || "",
        },
        {
          section: "3구간",
          status: statusMap[apiData.cgdrCLvl]?.text || "",
          statusColor: statusMap[apiData.cgdrCLvl]?.color || "",
        },
        {
          section: "전체 구간",
          status: statusMap[apiData.cgdrAllLvl]?.text || "",
          statusColor: statusMap[apiData.cgdrAllLvl]?.color || "",
        },
      ]
    : [
        {
          section: "1구간",
          status: "원활",
          statusColor: "bg-green100 text-green500",
        },
        {
          section: "2구간",
          status: "보통",
          statusColor: "bg-yellow100 text-yellow500",
        },
        {
          section: "3구간",
          status: "혼잡",
          statusColor: "bg-red100 text-red500",
        },
        {
          section: "전체 구간",
          status: "매우혼잡",
          statusColor: "bg-red100 text-red500",
        },
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
    },
  };

  const sizeClass = "px-2 py-1 text-[12px] rounded-md";

  const labels = Array.from({ length: 24 }, (_, index) =>
    `${String(index).padStart(2, "0")}~${String(index + 1).padStart(2, "0")}시`
  );

  const yLabels = ["원활", "보통", "혼잡", "매우혼잡"];

  const getStatusText = (value: number) => {
    return yLabels[value - 1] || "";
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
      },
    ],
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
            size: 11,
          },
        },
        grid: { display: false },
      },
      y: {
        ticks: {
          callback: function (tickValue: string | number) {
            return yLabels[Number(tickValue) - 1];
          },
          stepSize: 1,
          min: 1,
          max: 4,
        },
        grid: {
          display: true,
          color: "rgba(0, 0, 0, 0.1)",
          borderDash: [5, 5],
          lineWidth: 1,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.raw;
            return `혼잡도: ${getStatusText(value)}`;
          },
        },
      },
    },
  };

  return (
    <div className="relative flex">
      <div>
        <div className="mb-2 w-[460px] text-[22px] text-black font-bold mt-2 ml-2 mb-[-3]">
          {message}
        </div>
        <div className="mb-4 w-[480px] text-[14px] text-gray400 ml-2 mb-7">
          표에서 셀을 클릭하면 시간별 그래프를 보실 수 있습니다.
        </div>
        <div className="w-[420px] ml-2">
          <div className="mt-6 grid grid-cols-2 bg-gray300 p-2 text-center text-grayCustom font-regular text-[14px]">
            <div>구간</div>
            <div>혼잡도</div>
          </div>
          <div className="border-b border-gray-200">
            {sectionStatuses.map((sectionStatus, index) => (
              <div
                key={index}
                onClick={() => setSelectedSection(sectionStatus.section)}
                className="grid grid-cols-2 p-4 border-b last:border-b-0 text-center hover:bg-gray350 transition-colors duration-200 cursor-pointer"
              >
                <div className="font-medium text-black">{sectionStatus.section}</div>
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
        <div className="mb-2 text-[22px] text-black font-bold ml-2 mt-[-68] mb-[32] flex justify-between items-center">
          <div>{`${selectedSection} 혼잡도 그래프`}</div>
          <div className="flex items-center">
            <button
              onClick={() => setSelectedDate("어제")}
              className={`px-4 py-2 text-[14px] font-medium border ${
                selectedDate === "어제"
                  ? "bg-lightBlueBackground text-lightBlueText border-lightBlueBorder"
                  : "bg-gray200 text-gray700 border-grayBorder"
              } rounded-md flex items-center mr-2`}
            >
              어제
              <Image
                src="/date.svg"
                width={16}
                height={16}
                alt="date"
                className={`ml-2 ${
                  selectedDate === "어제" ? "text-gray500" : "text-gray700"
                }`}
              />
            </button>
            <button
              onClick={() => setSelectedDate("오늘")}
              className={`px-4 py-2 text-[14px] font-medium border ${
                selectedDate === "오늘"
                  ? "bg-lightBlueBackground text-lightBlueText border-lightBlueBorder"
                  : "bg-gray200 text-gray700 border-grayBorder"
              } rounded-md flex items-center`}
            >
              오늘
              <Image
                src="/date.svg"
                width={16}
                height={16}
                alt="date"
                className={`ml-2 ${
                  selectedDate === "오늘" ? "text-gray500" : "text-gray700"
                }`}
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
