'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
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
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

ChartJS.defaults.font.family = 'Pretendard, sans-serif';


type DateType = "어제" | "오늘";

type SectionStatus = {
  section: string;
  status: string;
  statusColor: string;
};

interface RealTimeApiResponse {
  cgdrAllLvl: number;
  cgdrALvl: number;
  cgdrBLvl: number;
  cgdrCLvl: number;
}

type CongestionRecord = {
  cgdrAllLvl: number;
  cgdrALvl: number;
  cgdrBLvl: number;
  cgdrCLvl: number;
  date: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const transformStatusValue = (value: number) => {
  if (value === 0 || value === 1) return 1;
  if (value === 2) return 2;
  if (value === 3 || value === 4) return 3;
  return value;
};

const getStatusText = (value: number) => {
  if (value === 1) return "원활";
  if (value === 2) return "보통";
  if (value === 3) return "혼잡";
  return "";
};

const TrafficStatus = () => {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        ChartJS.defaults.font.weight = 500;
        ChartJS.defaults.font.size = 13;
      } else {
        ChartJS.defaults.font.weight = 400;
        ChartJS.defaults.font.size = 11;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const message = "실시간 공항 구간별 혼잡도 확인";
  const [selectedSection, setSelectedSection] = useState("1구간");
  const [selectedDate, setSelectedDate] = useState<DateType>("오늘");

  const { data: apiData, error } = useSWR<RealTimeApiResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/congestions/real`,
    fetcher
  );
  const { data: congestionHistory, error: historyError } = useSWR<CongestionRecord[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/congestions`,
    fetcher
  );

  if (error || historyError) {
    return <div>Error loading data...</div>;
  }

  if (!apiData || !congestionHistory) {
    return (
      <div className="relative flex flex-col lg:flex-row">
        <div className="w-full lg:w-auto flex flex-col items-center lg:items-start">
          <div className="w-full lg:w-[460px] text-[22px] text-black font-bold mt-2 ml-2 mb-[-3]">
            <Skeleton height={28} />
          </div>
          <div className="w-full lg:w-[480px] text-[14px] text-gray400 ml-2 mb-7">
            <Skeleton height={20} />
          </div>
          <div className="w-full max-w-[420px] lg:w-[420px] ml-2">
            <div className="mt-6 grid grid-cols-2 bg-gray300 p-2 text-center text-grayCustom font-regular text-[14px]">
              <div>
                <Skeleton height={20} />
              </div>
              <div>
                <Skeleton height={20} />
              </div>
            </div>
            <div className="border-b border-gray-200">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="grid grid-cols-2 p-4 border-b last:border-b-0 text-center"
                >
                  <div className="font-medium text-black">
                    <Skeleton height={20} />
                  </div>
                  <div>
                    <Skeleton height={20} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-[670px] h-auto min-h-[280px] p-4 mt-8 lg:mt-14 lg:ml-4">
          <div className="mb-2 text-[22px] text-black font-bold ml-2 mt-0 lg:mt-[-68] mb-[32] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-0">
            <div className="w-full lg:w-[200px]">
              <Skeleton height={28} />
            </div>
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <Skeleton height={28} width={80} />
              <Skeleton height={28} width={80} />
            </div>
          </div>
          <div className="h-[280px]">
            <Skeleton height="100%" />
          </div>
        </div>
      </div>
    );
  }

  const statusMap: { [key: number]: { text: string; color: string } } = {
    0: { text: "원활", color: "bg-green100 text-green500" },
    1: { text: "원활", color: "bg-green100 text-green500" },
    2: { text: "보통", color: "bg-yellow100 text-yellow500" },
    3: { text: "혼잡", color: "bg-red100 text-red500" },
    4: { text: "혼잡", color: "bg-red100 text-red500" },
  };

  const sectionStatuses: SectionStatus[] = [
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
  ];

  const extractDateAndHour = (dateStr: string) => {
    const [datePart, hourPart] = dateStr.split(" ");
    const hour = hourPart.replace("시", "");
    return { date: datePart, hour };
  };

  const todayDateStr = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDateStr = yesterday.toISOString().split("T")[0];

  const recordsForSelectedDate = congestionHistory.filter((record) => {
    const { date } = extractDateAndHour(record.date);
    return selectedDate === "오늘" ? date === todayDateStr : date === yesterdayDateStr;
  });

  const dedupedRecordsObj = recordsForSelectedDate.reduce((acc, record) => {
    const { hour } = extractDateAndHour(record.date);
    if (!acc[hour]) {
      acc[hour] = record;
    }
    return acc;
  }, {} as Record<string, CongestionRecord>);

  const dedupedRecords = Object.values(dedupedRecordsObj).sort((a, b) => {
    const { hour: hourA } = extractDateAndHour(a.date);
    const { hour: hourB } = extractDateAndHour(b.date);
    return Number(hourA) - Number(hourB);
  });

  const generateChartData = (records: CongestionRecord[], section: string) => {
    const labels = records.map((record) => {
      const { hour } = extractDateAndHour(record.date);
      return `${hour}시`;
    });
    const data = records.map((record) => {
      let rawValue = 0;
      if (section === "1구간") rawValue = record.cgdrALvl;
      else if (section === "2구간") rawValue = record.cgdrBLvl;
      else if (section === "3구간") rawValue = record.cgdrCLvl;
      else if (section === "전체 구간") rawValue = record.cgdrAllLvl;
      return transformStatusValue(rawValue);
    });
    return { labels, data };
  };

  const { labels: dynamicLabels, data: dynamicData } = generateChartData(dedupedRecords, selectedSection);

  const chartData = {
    labels: dynamicLabels,
    datasets: [
      {
        label: `${selectedSection} 시간별 혼잡도`,
        data: dynamicData,
        borderColor: "#215DCE",
        backgroundColor: "rgba(33, 93, 206, 0.2)",
        borderWidth: window.innerWidth < 768 ? 3 : 2,
        pointRadius: window.innerWidth < 768 ? 8 : 6,
        pointBackgroundColor: "#215DCE",
        pointBorderColor: "#FFFFFF",
        pointBorderWidth: 2,
        tension: 0.4,
        segment: {
          borderWidth: window.innerWidth < 768 ? 3 : 2,
        },
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
            size: window.innerWidth < 768 ? 13 : 11
          },
        },
        grid: { display: false },
      },
      y: {
        ticks: {
          callback: (tickValue: string | number) => getStatusText(Number(tickValue)),
          stepSize: 1,
          min: 1,
          max: 3,
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
          label: (context: any) => `혼잡도: ${getStatusText(Number(context.raw))}`,
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: window.innerWidth < 768 ? 3 : 2,
      },
    },
  };

  return (
    <div className="relative flex flex-col lg:flex-row">
      <div className="w-full lg:w-auto flex flex-col items-center lg:items-start">
        <div className="mb-2 w-full lg:w-[460px] text-[22px] text-black font-bold mt-2 ml-2 mb-[-3]">
          {message}
        </div>
        <div className="mb-4 w-full lg:w-[480px] text-[14px] text-gray400 ml-2 mb-[-9]">
          <span className="hidden lg:inline">표에서 셀을 클릭하면 시간별 그래프를 보실 수 있습니다.</span>
          <span className="lg:hidden">클릭하면 그래프를 볼 수 있어요.</span>
        </div>
        <div className="w-full max-w-[420px] lg:w-[420px] ml-2">
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
                  <span className={`px-2 py-1 text-[12px] rounded-md ${sectionStatus.statusColor}`}>
                    {sectionStatus.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[670px] h-auto min-h-[280px] p-4 mt-8 lg:mt-14 lg:ml-4">
        <div className="mb-2 text-[22px] text-black font-bold ml-[10px] lg:ml-2 lg:mt-[-68] mb-[32px] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-0">
          <div className="ml-[-10px] lg:ml-0">{`${selectedSection} 혼잡도 그래프`}</div>
          <div className="flex items-center ml-[-10px] lg:ml-0">
            <button
              onClick={() => setSelectedDate("어제")}
              className={`px-4 py-1 lg:py-2 text-[14px] font-medium border ${
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
                className={`ml-2 hidden lg:inline ${selectedDate === "어제" ? "text-gray500" : "text-gray700"}`}
              />
            </button>
            <button
              onClick={() => setSelectedDate("오늘")}
              className={`px-4 py-1 lg:py-2 text-[14px] font-medium border ${
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
                className={`ml-2 hidden lg:inline ${selectedDate === "오늘" ? "text-gray500" : "text-gray700"}`}
              />
            </button>
          </div>
        </div>
        <div className="h-[280px]">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default TrafficStatus;

