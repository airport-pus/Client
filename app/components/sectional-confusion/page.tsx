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
  TooltipItem,
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

// 한국어 구간명을 영어로 변환하는 함수
const getEnglishSectionName = (section: string) => {
  switch (section) {
    case "1구간":
      return "Section 1";
    case "2구간":
      return "Section 2";
    case "3구간":
      return "Section 3";
    case "전체 구간":
      return "All Sections";
    default:
      return "";
  }
};

const TrafficStatus = () => {
  const [selectedSection, setSelectedSection] = useState<string>("전체 구간");
  const [selectedDate, setSelectedDate] = useState<DateType>("오늘");

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 768) {
          ChartJS.defaults.font.weight = 500;
          ChartJS.defaults.font.size = 13;
        } else {
          ChartJS.defaults.font.weight = 400;
          ChartJS.defaults.font.size = 11;
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const { data: apiData, error: realTimeError } = useSWR<RealTimeApiResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/congestions/real`,
    fetcher
  );
  const { data: congestionHistory, error: historyError } = useSWR<CongestionRecord[]>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/congestions`,
    fetcher
  );

  // ── 왼쪽 컨텐츠 (두번째 코드에서 가져온 부분) ──
  let leftContent;
  if (realTimeError) {
    leftContent = <div className="p-4 text-red-500 text-center">404</div>;
  } else if (apiData === undefined) {
    leftContent = (
      <div className="mb-4 ml-8">
        <h2 className="text-[20px] font-bold mb-0 text-black mt-5">
          <Skeleton width={220} height={24} />
        </h2>
        <p className="mb-4 text-gray400 text-[14px]">
          <Skeleton width={250} height={18} />
        </p>
        <ul className="divide-y divide-gray-200">
          {Array.from({ length: 4 }).map((_, index) => (
            <li key={index} className="cursor-pointer flex items-center justify-between py-4 px-4 hover:bg-gray-50 transition">
              <span className="text-lg font-bold text-black">
                <Skeleton width={80} height={20} />
              </span>
              <span className="inline-block px-3 py-1 text-sm rounded">
                <Skeleton width={50} height={20} />
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  } else if (!apiData) {
    leftContent = <div className="p-4 text-red-500 text-center">404</div>;
  } else {
    const statusMap: { [key: number]: { text: string; color: string } } = {
      0: { text: "원활", color: "bg-green100 text-green500" },
      1: { text: "원활", color: "bg-green100 text-green500" },
      2: { text: "보통", color: "bg-yellow100 text-yellow500" },
      3: { text: "혼잡", color: "bg-red100 text-red500" },
      4: { text: "매우 혼잡", color: "bg-red100 text-red500" },
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

    leftContent = (
      <div className="mb-4 ml-8">
        <h2 className="text-[20px] font-bold mb-3 text-black mt-5 ml-[-24px]">
          실시간 공항 구간별 혼잡도 확인
        </h2>
        <p className="mb-4 text-gray400 text-[14px] ml-[-24px] mt-[-11px] mb-[4px]">
          항목을 클릭하면 시간별 그래프를 보실 수 있습니다.
        </p>
        <ul className="divide-y divide-gray-200 ml-[-36px]">
          {sectionStatuses.map((sectionStatus, index) => (
            <li
              key={index}
              onClick={() => setSelectedSection(sectionStatus.section)}
              className="cursor-pointer flex items-center justify-between py-4 px-4 hover:bg-gray-50 transition"
            >
              <span className="text-lg font-bold text-black text-[14px]">
                <span className="mr-5 text-xl">·</span>
                {sectionStatus.section}
                <span className="ml-2 text-[12px] text-gray-400 font-normal">
                  {getEnglishSectionName(sectionStatus.section)}
                </span>
              </span>
              <span className={`inline-block px-3 py-1 text-sm rounded ${sectionStatus.statusColor}`}>
                {sectionStatus.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  // ── 끝 ──

  // ── 오른쪽 차트 관련 로직 (첫번째 코드에서 사용한 부분) ──
  const extractDateAndHour = (dateStr: string) => {
    const [datePart, hourPart] = dateStr.split(" ");
    const hour = hourPart.replace("시", "");
    return { date: datePart, hour };
  };

  const todayDateStr = new Date().toISOString().split("T")[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDateStr = yesterday.toISOString().split("T")[0];

  let recordsForSelectedDate: CongestionRecord[] = [];
  if (congestionHistory) {
    recordsForSelectedDate = congestionHistory.filter((record) => {
      const { date } = extractDateAndHour(record.date);
      return selectedDate === "오늘" ? date === todayDateStr : date === yesterdayDateStr;
    });
  }

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
        borderWidth: (typeof window !== 'undefined' && window.innerWidth < 768) ? 3 : 2,
        pointRadius: (typeof window !== 'undefined' && window.innerWidth < 768) ? 8 : 6,
        pointBackgroundColor: "#215DCE",
        pointBorderColor: "#FFFFFF",
        pointBorderWidth: 2,
        tension: 0.4,
        segment: {
          borderWidth: (typeof window !== 'undefined' && window.innerWidth < 768) ? 3 : 2,
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
            size: (typeof window !== 'undefined' && window.innerWidth < 768) ? 13 : 11,
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
          label: (tooltipItem: TooltipItem<'line'>) =>
            `혼잡도: ${getStatusText(Number(tooltipItem.raw))}`,
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: (typeof window !== 'undefined' && window.innerWidth < 768) ? 3 : 2,
      },
    },
  };
  
  if (historyError) {
    return <div>Error loading data...</div>;
  }

  if (!congestionHistory) {
    return (
      <div className="relative flex flex-col lg:flex-row">
        <div className="w-full max-w-[370px] lg:w-[800px] mx-auto lg:ml-0">
          {leftContent}
        </div>
        <div className="w-full lg:w-[670px] h-auto min-h-[280px] p-4 mt-8 lg:mt-14 lg:ml-2">
          <div className="h-[280px]">
            <Skeleton height="100%" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col lg:flex-row">
      <div className="w-full max-w-[370px] lg:w-[800px] mx-auto lg:ml-0">
        {leftContent}
      </div>
      <div className="w-full lg:w-[670px] h-auto min-h-[280px] p-4 mt-8 lg:mt-14 lg:ml-2">
        <div className="mb-2 text-[22px] text-black font-bold ml-[10px] lg:ml-2 lg:mt-[-68] mb-[32px] flex flex-row justify-between items-center gap-4">
          <div className="text-xl font-bold text-black">
            <span className="lg:hidden ml-[-13px]">{`${selectedSection} 혼잡도`}</span>
            <span className="hidden lg:inline">{`${selectedSection} 혼잡도 그래프`}</span>
          </div>
        </div>
        <div className="mb-4 text-[14px] text-gray400 ml-[10px] lg:ml-2 mt-[-38] hidden lg:block">
          파란색 점을 누르면 세부정보를 볼 수 있어요.
        </div>
        <div className="h-[280px]">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default TrafficStatus;
