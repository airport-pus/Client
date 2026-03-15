export default function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={`relative flex min-h-[280px] flex-col justify-end overflow-hidden bg-white pb-0 font-poppins md:min-h-[320px] ${className ?? ""}`}
    >
      <div className="flex w-full flex-1 flex-col justify-end px-6 pb-0 pt-4 text-center md:px-8">
        <p
          className="mb-0 block leading-[0.85] font-bold text-gray-900 select-none translate-y-1 md:translate-y-2 tracking-[0.02em] md:tracking-[0.03em]"
          style={{
            fontSize: "clamp(4rem, 18vw, 11rem)",
          }}  
        >
          1Gate
        </p>
      </div>
    </footer>
  )
}