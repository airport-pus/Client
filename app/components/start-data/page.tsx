"use client";
import React from "react";

interface Flight {
  airline: string;
  flightNumber: string;
  destination: string;
  gate: number;
  status: string;
  scheduledTime: string;
  modifiedTime: string;
  delay: string | null;
  logo: string;
}

interface StartDataProps {
  displayedFlights: Flight[];
  lastFlightElementRef: (node: HTMLElement | null) => void;
}

const StartData: React.FC<StartDataProps> = ({ displayedFlights, lastFlightElementRef }) => {
  return (
    <>
      {displayedFlights.map((flight, index) => (
        <div
          key={index}
          ref={index === displayedFlights.length - 1 ? lastFlightElementRef : null}
          className="grid grid-cols-5 border-b p-4 items-center"
        >
          <div className="flex items-center gap-2 ml-14">
            <img src={flight.logo} alt={flight.airline} className="w-8 h-8" />
            <div>
              <div className="text-[#000000]">{flight.flightNumber}</div>
              <div className="text-[#606060] text-sm">{flight.airline}</div>
            </div>
          </div>
          <div className="text-center text-[#000000] ml-[-10px]">{flight.destination}</div>
          <div className="text-center text-blue-500">{flight.gate}</div>
          <div className={`text-center ml-2 ${flight.status === "지연" ? "text-red-500" : "text-blue-500"}`}>
            {flight.status}
          </div>
          <div className="flex flex-col items-start ml-14">
            <div className="text-sm text-[#606060]">예정 {flight.scheduledTime}</div>
            <div className="text-sm text-[#215DCE]">변경 {flight.modifiedTime}</div>
            {flight.delay && <div className="text-red-500 text-sm">지연 {flight.delay}</div>}
          </div>
        </div>
      ))}
    </>
  );
};

export default StartData;
