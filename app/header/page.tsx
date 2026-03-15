"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

const AIRPORTS = [
  { name: "김포국제공항", href: "#" },
  { name: "김해국제공항", href: "/" },
  { name: "인천국제공항", href: "#" },
  { name: "제주국제공항", href: "#" },
  { name: "청주국제공항", href: "#" },
  { name: "대구국제공항", href: "#" },
  { name: "양양국제공항", href: "#" },
]

const DEFAULT_AIRPORT = "김포국제공항"

export default function Header() {
  const [isAirportOpen, setIsAirportOpen] = useState(false)
  const [selectedAirport, setSelectedAirport] = useState(DEFAULT_AIRPORT)
  const airportRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!airportRef.current?.contains(event.target as Node)) {
        setIsAirportOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <header className="fixed top-0 left-0 w-full h-[76px] flex flex-col justify-center items-center px-6 md:px-[320px] py-[18px] gap-[10px] bg-white/20 backdrop-blur-[50px] z-50 box-border">
      <div className="w-full max-w-[1280px] flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="block">
            <Image src="/logo.svg" alt="logo" width={80} height={80} className="h-9 w-auto md:h-10" />
          </Link>
        </div>

        <nav className="flex items-center">
          <ul className="flex list-none gap-6 md:gap-[40px]">
            <li className="relative flex justify-center" ref={airportRef}>
              <button
                type="button"
                onClick={() => setIsAirportOpen((prev) => !prev)}
                className="text-[#2F3237] hover:text-[#878787] text-[16px] font-semibold transition-colors cursor-pointer"
              >
                공항 선택
              </button>
              {isAirportOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[160px] min-h-[98px] bg-white rounded-[10px] shadow-[0px_0px_10px_rgba(86,93,122,0.14)] flex flex-col items-start py-[8px] z-[100]">
                    {AIRPORTS.map((airport) => (
                      <Link
                        key={airport.name}
                        href={airport.href}
                        className="w-full px-3 flex flex-row items-center py-3 rounded-[6px] hover:bg-[#F6F6F7] transition-colors text-[#2F3237] text-[14px] font-medium"
                        onClick={() => {
                          setSelectedAirport(airport.name)
                          setIsAirportOpen(false)
                        }}
                      >
                        {airport.name}
                      </Link>
                    ))}
                  </div>
              )}
            </li>
            <li>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSeUhXwKLTGywR7-K-5tq480NcKpLVGyf_A0n_6BP8onk0uPSQ/viewform?usp=dialog"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2F3237] hover:text-[#878787] text-[16px] font-semibold transition-colors"
              >
                문의하기
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
