import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-[1280px] mx-auto px-5">  
        <div className="col-span-12 flex items-center gap-4 mb-8">
          <Image
            src="/logo.svg"
            alt="PUSAN logo"
            width={50}
            height={50}
          />
          <div>
            <h1 className="text-lg font-bold">김해국제공항의 모든 정보를 한 곳에서,</h1>
            <p className="text-sm text-gray-600">지금까지 333명이 페이지에 방문했어요.</p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-5 mb-5">
          <button className="col-span-4 py-2 px-4 rounded bg-white text-center">
            실시간 구간별 혼잡도
          </button>
          <button className="col-span-4 py-2 px-4 rounded text-center">
            실시간 출발 주기장 정보
          </button>
          <button className="col-span-4 py-2 px-4 rounded text-center">
            실시간 도착 주기장 정보
          </button>
        </div>

        <div className="col-span-12 bg-white rounded-lg p-4 min-h-[400px]">
        </div>
      </div>
    </div>
  );
}
