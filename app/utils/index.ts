import { TimeRange } from "@/types/TimeRange"
import { ParkingLot } from "@/types/ParkingLot";
import { VehicleSize } from "@/types/VehicleSize";
import { DiscountType } from "@/types/DiscountType";
import { ParkingFeeRequest } from "@/types/ParkingFeeRequest";
import { DISCOUNT_TYPE_MAP } from "@/constants/DISCOUNT_TYPE_MAP";

export const createParkingFeeRequest = (
  timeRange: TimeRange,
  parkingLot: ParkingLot,
  vehicleSize: VehicleSize,
  discountType: DiscountType
): ParkingFeeRequest => ({
  holidayMinutes: timeRange.weekdayMinutes,
  weekdayMinutes: timeRange.holidayMinutes,
  parkingLot: parkingLot === "P1P2" ? "P1" : "P3",
  isLargeCar: vehicleSize === "large",
  discountType: DISCOUNT_TYPE_MAP[discountType],
});

export const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2).toString().padStart(2, "0")
    const minute = i % 2 === 0 ? "00" : "30"
    return `${hour}:${minute}`
})

export const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
}

export const formatTime = (time: string | null): string => {
    if (!time) return "시간 미정";

    try {
        const hours = time.substring(0, 2);
        const minutes = time.substring(2, 4);
        if (hours && minutes) {
            return `2025-02-12 ${hours}:${minutes}`;
        }
        return "시간 미정";
    } catch (error) {
        return "시간 미정";
    }
};

export const isHoliday = (date: Date, holidayDates: string[]): boolean => {
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    return isWeekend || holidayDates.includes(formatDate(date))
}


export const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch flight data");
    return res.json();
};

export const calculateDelay = (std: string | null, etd: string | null): string | null => {
    if (!std || !etd) return null;

    try {
        const stdMinutes = parseInt(std.substring(0, 2)) * 60 + parseInt(std.substring(2, 4));
        const etdMinutes = parseInt(etd.substring(0, 2)) * 60 + parseInt(etd.substring(2, 4));

        if (isNaN(stdMinutes) || isNaN(etdMinutes)) return null;

        const delayMinutes = etdMinutes - stdMinutes;
        return delayMinutes > 0 ? `${delayMinutes}분` : null;
    } catch (error) {
        return null;
    }
};

export const getRemarkKor = (f: any): string | null => {
    if (!f.etd || !f.std) return null;
    else if (f.etd > f.std) return "지연";
    else if (f.etd === f.std) return "출발";
    else if (f.etd < f.std) return "연착";
    return null; // 그 외에는 상태 없음
}

export const calculateTimeRange = (
    startDate: string,
    startTime: string,
    endDate: string,
    endTime: string,
    holidayDates: string[]
): TimeRange => {
    const startDateTime = new Date(`${startDate}T${startTime}`)
    const endDateTime = new Date(`${endDate}T${endTime}`)

    if (endDateTime <= startDateTime) {
        return { weekdayMinutes: 0, holidayMinutes: 0 }
    }

    const currentDate = new Date(startDateTime)
    let weekdayMinutes = 0
    let holidayMinutes = 0

    while (currentDate < endDateTime) {
        if (isHoliday(currentDate, holidayDates)) {
            holidayMinutes++
        } else {
            weekdayMinutes++
        }
        currentDate.setMinutes(currentDate.getMinutes() + 1)
    }

    return { weekdayMinutes, holidayMinutes }
}