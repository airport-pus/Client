import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Scale } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const TrafficStatus = () => {
  const message = "실시간 공항 구간별 혼잡도 확인";
  const [selectedSection, setSelectedSection] = useState("1구간");
  
  const statusData = [
    { section: "1구간", status: "원활", statusColor: "bg-[#E2FFEB] text-[#16A34A]", chartData: [1, 2, 2, 3, 2, 1, 1, 2, 3, 4, 3, 2, 2, 1, 2, 3, 3, 4, 4, 3, 3, 2, 1, 1] },
    { section: "2구간", status: "보통", statusColor: "bg-[#FFFBD8] text-[#CA8A04]", chartData: [2, 2, 3, 3, 4, 4, 3, 2, 3, 3, 2, 2, 3, 4, 3, 3, 2, 3, 4, 4, 3, 2, 2, 2] },
    { section: "3구간", status: "혼잡", statusColor: "bg-[#FFECEC] text-[#FF0000]", chartData: [3, 3, 3, 4, 4, 4, 4, 3, 3, 4, 3, 3, 4, 4, 3, 4, 4, 4, 3, 3, 2, 2, 3, 3] },
    { section: "전체", status: "매우혼잡", statusColor: "bg-[#FFECEC] text-[#FF0000]", chartData: [4, 4, 4, 4, 4, 4, 4, 4, 3, 3, 3, 3, 4, 4, 4, 3, 4, 4, 4, 3, 3, 3, 2, 2] }
  ];
  
  const sizeClass = "px-4 py-2 rounded-md";
  
  const labels = [
    "00~01시", "01~02시", "02~03시", "03~04시", "04~05시", "05~06시",
    "06~07시", "07~08시", "08~09시", "09~10시", "10~11시", "11~12시",
    "12~13시", "13~14시", "14~15시", "15~16시", "16~17시", "17~18시",
    "18~19시", "19~20시", "20~21시", "21~22시", "22~23시", "23~24시"
  ];
  const yLabels = ["원활", "보통", "혼잡", "매우혼잡"];

  const selectedData = statusData.find(item => item.section === selectedSection);

  const chartData = {
    labels,
    datasets: [
        {
          label: `${selectedSection} 시간별 혼잡도`,
          data: selectedData?.chartData || [],
          borderColor: "#215DCE",
          backgroundColor: "rgba(33, 93, 206, 0.2)",
          borderWidth: 2,
          pointRadius: 6,   
          pointBackgroundColor: "#215DCE",
          pointBorderColor: "#FFFFFF",
          pointBorderWidth: 2,
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
            callback: function(tickValue: string | number) {
            return yLabels[Number(tickValue) - 1];
          },
          stepSize: 1,
          min: 1,
          max: 4
        },
        grid: { display: false }
      }
    }
  } as const;
  
  return (
    <div className="relative flex">
      <div>
        <div className="mb-2 w-[480px] text-[22px] text-[#000000] font-bold mt-2 ml-2 mb-[-3]">
          {message}
        </div>
        <div className="mb-4 w-[480px] text-[14px] text-[#7B7B7B] ml-2">
          표에서 셀을 클릭하면 시간별 그래프를 보실 수 있습니다.
        </div>
        <div className="w-[420px] ml-2">
          <div className="bg-[#1E3A8A] text-white p-4 rounded-t-lg grid grid-cols-2 text-center">
            <div className="font-medium">구간</div>
            <div className="font-medium">혼잡도</div>
          </div>
          <div className="border border-gray-200 rounded-b-lg">
            {statusData.map((item, index) => (
              <div key={index} onClick={() => setSelectedSection(item.section)}
                className="grid grid-cols-2 p-4 border-b last:border-b-0 text-center hover:bg-[#F3F3F3] transition-colors duration-200 cursor-pointer">     
                <div className="font-medium text-[#000000]">{item.section}</div>
                <div>
                  <span className={`${sizeClass} ${item.statusColor}`}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="ml-4 w-[670px] h-[324px] p-4 mt-14">
        <div className="mb-2 text-[22px] text-[#000000] font-bold ml-2 mt-[-64] mb-[32]">
          {`${selectedSection} 혼잡도 그래프`}
        </div>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TrafficStatus;
