"use client";
import React from "react";
import Image from "next/image";

export interface Flight {
  airline: string;
  flightNumber: string;
  destination: string;
  gate: string;
  status: string;
  scheduledTime: string;
  modifiedTime: string;
  delay: string | null;
  logo: string;
}

export interface StartDataProps {
  displayedFlights: Flight[];
  lastFlightElementRef: (node: HTMLElement | null) => void;
}

const StartDataComponent: React.FC<StartDataProps> = ({
  displayedFlights,
  lastFlightElementRef,
}) => {
  // const today = new Date(); 
  // const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };

  return (
    <>
      {displayedFlights.map((flight, index) => (
        <div
          key={index}
          ref={
            index === displayedFlights.length - 1 ? lastFlightElementRef : null
          }
          className="grid grid-cols-5 border-b p-4 items-center"
        >
          <div className="flex items-center gap-2 ml-14">
            <Image
              src={flight.logo}
              alt={flight.airline}
              width={24}
              height={24}
              className="w-8 h-8"
            />
            <div>
              <div className="text-black">{flight.flightNumber}</div>
              <div className="text-grayCustom text-sm">{flight.airline}</div>
            </div>
          </div>
          <div className="text-center text-black ml-[-10px]">
            {flight.destination}
          </div>
          <div className="text-center text-blue-500">{flight.gate}</div>
          <div className={`text-center ml-2 ${flight.status === "지연" ? "text-red-500" : "text-blue-500"}`}>
            {flight.status}
          </div>
          <div className="flex flex-col items-start ml-14">
            <div className="text-sm text-grayCustom">
              예정 {flight.scheduledTime}
            </div>
            <div className="text-sm text-blue500">
              변경 {flight.modifiedTime}
            </div>
            {flight.delay && (
              <div className="text-red-500 text-sm">지연 {flight.delay}</div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default StartDataComponent;
