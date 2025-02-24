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
      event.preventDefault();
      setDeferredPrompt(event);
      if (window.innerWidth < 768) {
        setShowPwaBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", (event) => {
      handleBeforeInstallPrompt(event as BeforeInstallPromptEvent);
    });

    if (process.env.NODE_ENV === "development") {
      setShowPwaBanner(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", (event) => {
        handleBeforeInstallPrompt(event as BeforeInstallPromptEvent);
      });
    };
  }, []);

  // PWA 배너가 보일 때 스크롤과 터치 이벤트를 막음
  useEffect(() => {
    if (showPwaBanner) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showPwaBanner]);

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
      {showPwaBanner && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" />
          <div className="fixed bottom-[68px] left-1/2 transform -translate-x-1/2 bg-white text-black font-pretendard md:hidden px-[16px] py-[56px] md:px-[24px] md:py-[24px] rounded-[13px] shadow-lg flex flex-col items-center space-y-[12px] min-w-[300px] md:min-w-[350px] z-50">
            <div className="translate-y-[40px] w-full">
              <div className="flex flex-col justify-end flex-grow">
                <div className="text-center">
                  <img
                    src="/pwa.svg"
                    alt="Logo"
                    className="mx-auto mb-4 mt-[-60px] w-[190px]"
                  />
                  <div>
                    <span className="font-bold">airport-pus</span>
                    <span className="font-light"> 앱으로</span>
                  </div>
                  <div className="font-light">
                    빠르게 서비스 이용해보세요.
                  </div>
                </div>
              </div>
              <div className="mt-[20px] w-full flex flex-col items-center space-y-[10px]">
                <button className="bg-blue500 text-white w-[260px] h-[46px] rounded-[20px]" onClick={handleInstallPwa}>
                  앱에서 보기
                </button>
                <button className="text-gray-500 text-sm w-full px-[16px] py-[8px] rounded-[6px]" onClick={() => setShowPwaBanner(false)}>
                  <span className="block -mt-2.5">오늘은 그냥 볼게요.</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
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
                selected === 1 ? "bg-white text-blue500 font-[600]" : "text-[#7B7B7B]"
              }`}
              onClick={() => handleButtonClick(1)}
            >
              <span className="hidden md:inline">실시간 구간별 혼잡도</span>
              <span className="md:hidden">혼잡도</span>
            </button>
            <button
              className={`col-span-1 md:col-span-4 py-1.5 md:py-2 px-2 md:px-4 rounded-[8px] text-[14px] md:text-[16px] transition-colors ${
                selected === 2 ? "bg-white text-blue500 font-[600]" : "text-[#7B7B7B]"
              }`}
              onClick={() => handleButtonClick(2)}
            >
              <span className="hidden md:inline">실시간 출발 주기장 정보</span>
              <span className="md:hidden">출발정보</span>
            </button>
            <button
              className={`col-span-1 md:col-span-4 py-1.5 md:py-2 px-2 md:px-4 rounded-[8px] text-[14px] md:text-[16px] transition-colors ${
                selected === 3 ? "bg-white text-blue500 font-[600]" : "text-[#7B7B7B]"
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
        </div>
      </main>
      <Footer className="mt-auto" />
    </div>
  )
}
