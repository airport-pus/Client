"use client"

import { MdInfoOutline } from "react-icons/md"

const InfoCallout = () => {
  const message = "국내선은 1시간 30분 전, 국제선은 2시간 30분 전에 도착하는 것이 좋습니다." 

  return (
    <div className="absolute top-5 left-4 bg-[#EFF6FF] p-3 rounded-md flex items-center gap-2 text-[#4F5561] border border-[#BFDBFE]">
      <MdInfoOutline className="text-lg" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}

export default InfoCallout
