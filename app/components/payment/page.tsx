import Image from "next/image";

interface PaymentProps {
  parkingFee: number | null;
  onRetry: () => void;
}

const Payment = ({ parkingFee, onRetry }: PaymentProps) => {
  return (
    <div className="flex items-center flex-col justify-center h-full gap-1">
      <Image src="/Payment.svg" alt="payment" width={180} height={50} />
      <p className="text-[20px] font-bold text-[#000000]">
        예상 주차 요금은 <span className="text-[24px] text-blue500">{parkingFee?.toLocaleString()}원</span> 입니다
      </p>
      <button
        className={`h-[40px] w-[130px] bg-lightBlueBackground
          text-lightBlueText border-lightBlueBorder
          text-[14px] border-2 
          rounded-[8px] 
          transition-all duration-200 ease-in-out 
        `}
        onClick={onRetry}
      >
        다시 조회하기
      </button>
    </div>
  );
};

export default Payment;
