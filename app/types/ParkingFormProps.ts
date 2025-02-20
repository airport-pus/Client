import { ParkingLot } from "./ParkingLot"
import { VehicleSize } from "./VehicleSize" 
import { DiscountType } from "./DiscountType" 
import { ParkingOptionsProps } from "./ParkingOptionsProps"

export interface ParkingFormProps {
    dates: {
        startDate: string
        startTime: string
        endDate: string
        endTime: string
    }
    parkingOptions: {
        parkingLot: ParkingLot
        vehicleSize: VehicleSize
        discountType: DiscountType
    }
    onOptionChange: (
        field: keyof ParkingOptionsProps["parkingOptions"]
    ) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void
    onDateChange: (
        field: keyof ParkingFormProps["dates"]
    ) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => void
    onCalculate: () => void
}