import { ParkingLot } from "@/types/ParkingLot"
import { VehicleSize } from "@/types/VehicleSize"
import { DiscountType } from "@/types/DiscountType"

export interface ParkingOptionsProps {
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
}
