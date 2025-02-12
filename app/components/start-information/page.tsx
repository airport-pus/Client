"use client";

export default function StartInformation() {
  const compareTime = (scheduled: any, modified: any) => {
    return scheduled === modified;
  };

  return (
    <>
      <div className="mt-14 p-4 border-l-4 border-[#215DCE] bg-[#EFF6FF] text-black mt-3">
        <p className="font-bold text-[19px]">출발 주기장 이용 안내</p>
        <p className="text-[16px] mt-2">• 이 주기장은 김해국제공항에서 출발하는 항공기의 주기장입니다.</p>
        <p className="text-[16px] mt-1">• 항공편명을 검색하여 원하는 항공편 정보를 쉽게 확인할 수 있습니다.</p>
        <p className="text-[16px] mt-1">
          • <strong>예정</strong>: 계획된 출발 시간
        </p>
        <p className="text-[16px] mt-1">
          • <strong>변경</strong>: 변경된 출발 시간
        </p>
        <p className="text-[16px] text-red-500 mt-1">
          • <strong>빨간색 표시</strong>: 항공편이 지연된 경우, 지연 시간을 함께 표시합니다.
        </p>
        <div className="mt-4">
          <div className="relative">
            <img
              src="/search.svg"
              alt="검색 아이콘"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#7A7A7A]"
            />
            <input
              type="text"
              placeholder="항공편명 검색"
              className="pl-10 p-2 border border-[#215DCE] rounded w-[320px]"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-5 bg-[#F7F7F7] p-2 text-center text-[#606060] font-regular text-[14px]">
        <div>항공사 및 항공편명</div>
        <div>도착지</div>
        <div>탑승구</div>
        <div>항공편 상태</div>
        <div>시간</div>
      </div>

      <div className="grid grid-cols-5 border-b p-4 items-center">
        <div className="flex items-center gap-2 ml-14">
          <img src="/logos/korean-air.webp" alt="대한항공" className="w-8 h-8" />
          <div>
            <div className="text-[#000000]">KE4440</div>
            <div className="text-[#606060] text-sm">대한항공</div>
          </div>
        </div>
        <div className="text-center text-[#000000] ml-[-10px]">제주</div>
        <div className="text-center text-blue-500">3</div>
        <div className="text-center text-blue-500 ml-2">마감 예정</div>
        <div className="flex flex-col items-start ml-14">
          <div className="text-sm text-[#606060]">예정 2025-02-12 08:35</div>
          <div className="text-sm text-[#215DCE]">변경 2025-02-12 08:40</div>
          <div className="text-red-500 text-sm">지연 5분</div>
        </div>
      </div>

      <div className="grid grid-cols-5 border-b p-4 items-center">
        <div className="flex items-center gap-2 ml-14">
          <img src="/logos/korean-air.webp" alt="대한항공" className="w-8 h-8" />
          <div>
            <div className="text-[#000000]">KE4440</div>
            <div className="text-[#606060] text-sm">대한항공</div>
          </div>
        </div>
        <div className="text-center text-[#000000] ml-[-10px]">제주</div>
        <div className="text-center text-blue-500">3</div>
        <div className="text-center text-red-500 ml-2">지연</div>
        <div className="flex flex-col items-start ml-14">
          <div className="text-sm text-[#606060]">예정 2025-02-12 08:35</div>
          <div className="text-sm text-[#606060]">변경 2025-02-12 08:35</div>
        </div>
      </div>
    </>
  );
}
