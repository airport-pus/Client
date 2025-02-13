import Image from "next/image";

interface PaymentProps {
  parkingFee: number | null;
  onRetry: () => void;
}

const Payment = ({ parkingFee, onRetry }: PaymentProps) => {
  return (
    <div className="flex items-center flex-col justify-center h-full gap-1">
      <Image src="/Payment.svg" alt="payment" width={180} height={50} />
      <p className="text-[20px] font-bold text-black mb-4 mt-2">
        예상 주차 요금은{" "}
        <span className="text-[24px] relative inline-block">
          <span className="relative z-10 mix-blend-multiply text-blue500">
            {parkingFee?.toLocaleString()}원
          </span>
          <span 
  className="absolute -bottom-[0] left-0 h-[60%] bg-yellow-200 origin-left animate-marker"
/>

        </span>
        {" "}입니다
      </p>
      <button
        className="h-[36px] w-[115px] bg-lightBlueBackground text-lightBlueText border-lightBlueBorder text-[14px] border-2 rounded-[8px] transition-all duration-200 ease-in-out mb-[-32px]"
        onClick={onRetry}
      >
        다시 조회하기
      </button>
    </div>
  );
};

export default Payment;