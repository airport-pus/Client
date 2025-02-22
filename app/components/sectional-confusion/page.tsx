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

// 추가된 함수: 한국어 구간명을 영어로 변환
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

  const { data: apiData, error: realTimeError } = useSWR<RealTimeApiResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/congestions/real`,
    fetcher
  );
  
  let leftContent;
  if (realTimeError) {
    leftContent = <div className="p-4 text-red-500 text-center">404</div>;
  } else if (apiData === undefined) {
    leftContent = (
      <div className="mb-4 ml-8">
        <h2 className="text-[20px] font-bold mb-[0px] text-black mt-5">
          <Skeleton width={220} height={24} />
        </h2>
        <p className="mb-4 text-gray400 text-[14px] mb-[0px]">
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
        <h2 className="text-[20px] font-bold mb-3 text-black mt-5 mb-[0px] ml-[-24px]">
          실시간 공항 구간별 혼잡도 확인
        </h2>
        <p className="mb-4 text-gray400 text-[14px] ml-[-24]">
          항목을 클릭하면 시간별 그래프를 보실 수 있습니다.
        </p>
        <ul className="divide-y divide-gray-200 ml-[-36]">
          {sectionStatuses.map((sectionStatus, index) => (
            <li
            key={index}
            onClick={() => setSelectedSection(sectionStatus.section)}
            className="cursor-pointer flex items-center justify-between py-4 px-4 hover:bg-gray-50 transition"
          >
            <span className="text-lg font-bold text-black text-[14px]">
              <span className="mr-5 text-xl">·</span>{sectionStatus.section}
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

  return (
    <div className="relative flex flex-col lg:flex-row">
      <div className="w-full max-w-[370px] lg:w-[800px] mx-auto lg:ml-0">
        {leftContent}
      </div>
    </div>
  );
};

export default TrafficStatus;

function setSelectedSection(section: string): void {
  throw new Error('Function not implemented.');
}
