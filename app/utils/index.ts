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

export const isHoliday = (date: Date, holidayDates: string[]): boolean => {
    const isWeekend = date.getDay() === 0 || date.getDay() === 6
    return isWeekend || holidayDates.includes(formatDate(date))
}
