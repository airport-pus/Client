"use client";
import React from "react";
import Image from "next/image"
import { StartDataProps } from "@/types/StartDataProps"; 

const StartData: React.FC<StartDataProps> = ({ displayedFlights, lastFlightElementRef }) => {
  return (
    <>
      {displayedFlights.map((flight, index) => (
        <div
          key={flight.flightNumber}
          ref={index === displayedFlights.length - 1 ? lastFlightElementRef : null}
          className="grid grid-cols-5 border-b p-4 items-center"
        >
          <div className="flex items-center gap-2 ml-14">
            <Image src={flight.logo} alt={flight.airline} width={24} height={24} className="w-8 h-8"/>
            <div>
              <div className="text-black">{flight.flightNumber}</div>
              <div className="text-grayCustom text-sm">{flight.airline}</div>
            </div>
          </div>
          <div className="text-center text-black">{flight.destination}</div>
          <div className="text-center text-blue-500">{flight.gate}</div>
          <div className={`text-center ml-2 ${flight.status === "지연" ? "text-red-500" : "text-blue-500"}`}>
            {flight.status}
          </div>
          <div className="flex flex-col items-start ml-14">
            <div className="text-sm text-grayCustom">예정 {flight.scheduledTime}</div>
            <div className="text-sm text-blue-500">변경 {flight.modifiedTime}</div>
            {flight.delay && <div className="text-red-500 text-sm">지연 {flight.delay}</div>}
          </div>
        </div>
      ))}
    </>
  );
};

export default StartData;
