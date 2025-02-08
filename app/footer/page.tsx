export default function Footer({ className }: { className?: string }) {
    return (
      <footer 
        className={`h-[89px] bg-white w-full relative ${className || ""}`}
        style={{
          boxShadow: '824px 178px 250px rgba(0, 0, 0, 0.01), 463px 100px 250px rgba(0, 0, 0, 0.05), 206px 44px 211px rgba(0, 0, 0, 0.09), 51px 11px 116px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div className="max-w-[1280px] mx-auto h-full flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 text-[14px] text-[#111111]">
            <span>Developed by</span>
            <a href="https://github.com/siniseong" target="_blank" rel="noopener noreferrer" className="text-[#2A5FEC] hover:underline">siniseong</a>
            <a href="https://github.com/gyumingim" target="_blank" rel="noopener noreferrer" className="text-[#2A5FEC] hover:underline">gyumingim</a>
            <a href="https://github.com/GSB0203" target="_blank" rel="noopener noreferrer" className="text-[#2A5FEC] hover:underline">gimseungbin</a>
          </div>
          <div className="text-[14px] text-[#6B7280] mt-1">
            © 2025 All rights reserved.
          </div>
        </div>
      </footer>
    );
  }
  