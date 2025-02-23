"use client"

import { useEffect, useState } from "react"
import Footer from "./footer/test"
import Header from "./header/page"
import ParkingCongestion from "./components/ParkingCongestion/page"
import FareCheck from "./components/FareCheck/page"
import SectionalConfusion from "./components/sectional-confusion/page"
import StartInformation from "./components/start-information/page"
import FinshInformation from "./components/finsh-information/page"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export default function Home() {
  const [selected, setSelected] = useState<number>(1)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPwaBanner, setShowPwaBanner] = useState(false)

  useEffect(() => {
    const savedTab = localStorage.getItem('selectedTab')
    if (savedTab) {
      setSelected(parseInt(savedTab))
    }
  }, [])

  const handleButtonClick = (index: number) => {
    setSelected(index)
    localStorage.setItem('selectedTab', index.toString())
  }

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault()
      setDeferredPrompt(event)
      if (window.innerWidth < 768) {
        setShowPwaBanner(true)
      }
    }

    window.addEventListener("beforeinstallprompt", (event) => {
      handleBeforeInstallPrompt(event as BeforeInstallPromptEvent)
    })

    return () => {
      window.removeEventListener("beforeinstallprompt", (event) => {
        handleBeforeInstallPrompt(event as BeforeInstallPromptEvent)
      })
    }
  }, [])

  const handleInstallPwa = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((choiceResult: { outcome: 'accepted' | 'dismissed'; platform: string }) => {
        if (choiceResult.outcome === "accepted") {
          console.log("PWA 설치 완료!")
        } else {
          console.log("PWA 설치 취소")
        }
        setShowPwaBanner(false) 
        setDeferredPrompt(null)
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow 2md:p-8 p-2 bg-[#F3F4F6] font-pretendard">
        <div className="max-w-[1280px] mx-auto 2md:px-5 px-2">
          <Header />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-5 mb-3 md:mb-5">
            <ParkingCongestion />
            <FareCheck />
          </div>

          <div className="grid grid-cols-3 md:grid-cols-12 gap-2 md:gap-5 mb-3 md:mb-5 bg-[#CDD4E5] rounded-lg p-1.5 md:p-2">
            <button
              className={`col-span-1 md:col-span-4 py-1.5 md:py-2 px-2 md:px-4 rounded-[8px] text-[14px] md:text-[16px] transition-colors ${
                selected === 1 ? "bg-white text-[#2A5FEC] font-[600]" : "text-[#7B7B7B]"
              }`}
              onClick={() => handleButtonClick(1)}
            >
              <span className="hidden md:inline">실시간 구간별 혼잡도</span>
              <span className="md:hidden">혼잡도</span>
            </button>
            <button
              className={`col-span-1 md:col-span-4 py-1.5 md:py-2 px-2 md:px-4 rounded-[8px] text-[14px] md:text-[16px] transition-colors ${
                selected === 2 ? "bg-white text-[#2A5FEC] font-[600]" : "text-[#7B7B7B]"
              }`}
              onClick={() => handleButtonClick(2)}
            >
              <span className="hidden md:inline">실시간 출발 주기장 정보</span>
              <span className="md:hidden">출발정보</span>
            </button>
            <button
              className={`col-span-1 md:col-span-4 py-1.5 md:py-2 px-2 md:px-4 rounded-[8px] text-[14px] md:text-[16px] transition-colors ${
                selected === 3 ? "bg-white text-[#2A5FEC] font-[600]" : "text-[#7B7B7B]"
              }`}
              onClick={() => handleButtonClick(3)}
            >
              <span className="hidden md:inline">실시간 도착 주기장 정보</span>
              <span className="md:hidden">도착정보</span>
            </button>
          </div>

          <div className="relative col-span-12 bg-white rounded-lg p-3 md:p-4 min-h-[300px] md:min-h-[400px]">
            {selected === 1 && <SectionalConfusion />}
            {selected === 2 && <StartInformation />} 
            {selected === 3 && <FinshInformation />}
          </div>

          {showPwaBanner && (
            <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-blue500 text-white px-4 py-3 md:px-6 md:py-4 rounded-lg shadow-lg flex flex-nowrap items-center space-x-3 min-w-[300px] md:min-w-[350px]">
              <span className="whitespace-nowrap">앱을 설치해서 더 편하게 이용하세요!</span>
              <button className="bg-white text-blue500 px-3 py-1 rounded-md whitespace-nowrap" onClick={handleInstallPwa}>
                설치
              </button>
              <button className="text-white text-sm whitespace-nowrap" onClick={() => setShowPwaBanner(false)}>
                닫기
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer className="mt-auto" />
    </div>
  )
}
