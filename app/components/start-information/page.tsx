"use client"

export default function StartInformation() {
  return (
      <div className="mt-14 p-4 border-l-4 border-[#215DCE] bg-[#EFF6FF] mt-[12] text-black">
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
            <img src="/search.svg" alt="검색 아이콘" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#7A7A7A]" />
            <input 
              type="text" 
              placeholder="항공편명 검색" 
              className="pl-10 p-2 border border-[#215DCE] rounded w-[320px]"
            />
          </div>
        </div>
      </div>
  )
}
