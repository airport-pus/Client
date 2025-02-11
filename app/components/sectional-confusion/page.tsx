import React from 'react';

const TrafficStatus = () => {
  const message = "실시간 공항 구간별 혼잡도 확인";

  const statusData = [
    { section: "1구간", status: "원활", statusColor: "bg-[#E2FFEB] text-[#16A34A]" },
    { section: "2구간", status: "보통", statusColor: "bg-[#FFFBD8] text-[#CA8A04]" },
    { section: "3구간", status: "혼잡", statusColor: "bg-[#FFECEC] text-[#FF0000]" },
    { section: "전체", status: "매우혼잡", statusColor: "bg-[#FFECEC] text-[#FF0000]" }
  ];

  const sizeClass = "px-4 py-2"; 

  return (
    <div className="relative">
      <div className="mb-4 w-[480px] text-[22px] text-[#000000] font-bold mt-4 ml-2">
        {message}
      </div>

      <div className="w-[420px] ml-2">
        <div className="bg-[#1E3A8A] text-white p-4 rounded-t-lg grid grid-cols-2 text-center">
          <div className="font-medium">구간</div>
          <div className="font-medium">혼잡도</div>
        </div>
        <div className="border border-gray-200 rounded-b-lg">
          {statusData.map((item, index) => (
            <div key={index} className="grid grid-cols-2 p-4 border-b last:border-b-0 text-center hover:bg-[#F3F3F3] transition-colors duration-200">     
              <div className="font-medium text-[#000000]">{item.section}</div>
              <div>
                <span className={`rounded-md ${sizeClass} ${item.statusColor}`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrafficStatus;