import { DiscountType } from "@/types/DiscountType"

export const DISCOUNT_TYPE_MAP: Record<DiscountType, number> = {
    normal: 0,
    compact: 1,
    eco12: 2,
    eco3: 3,
    disabled: 4,
    children: 5,
    veteran: 6
}
  