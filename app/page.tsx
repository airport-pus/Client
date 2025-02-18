"use client"

import { useState } from "react"
import Footer from "./footer/page"
import Header from "./header/page"
import ParkingCongestion from "./components/ParkingCongestion/page"
import FareCheck from "./components/FareCheck/page"
import SectionalConfusion from "./components/sectional-confusion/page"
import StartInformation from "./components/start-information/page"
import FinshInformation from "./components/finsh-imformation/page"

export default function Home() {
  const [selected, setSelected] = useState<number>(1)

  const handleButtonClick = (index: number) => {
    setSelected(index)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow 2md:p-8 p-2 bg-[#F3F4F6] font-pretendard">
        <div className="max-w-[1280px] mx-auto 2md:px-5 px-2">
          <Header />

          <div className="grid grid-cols-12 gap-5 mb-5">
            <ParkingCongestion />
            <FareCheck />
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

          <div className="relative col-span-12 bg-white rounded-lg p-4 min-h-[400px]">
            {selected === 1 && <SectionalConfusion />}
            {selected === 2 && <StartInformation />} 
            {selected === 3 && <FinshInformation />}
          </div>
        </div>
      </main>
      <Footer className="mt-auto" />
    </div>
  )
}