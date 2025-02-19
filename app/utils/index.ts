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
