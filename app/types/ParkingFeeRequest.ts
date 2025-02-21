export interface ParkingFeeRequest {
    holidayMinutes: number
    weekdayMinutes: number
    parkingLot: string
    isLargeCar: boolean
    discountType: number
}
