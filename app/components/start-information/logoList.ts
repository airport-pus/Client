interface LogoMapping {
    [key: string]: string;
}

const airlineDictionary: LogoMapping = {
    '': 'air-china.svg',
    '': 'alitalia.svg',
    'ASIANA AIRLINE': 'asiana-air.png',
    '': 'cathay-pacific.png',
    'CHINA AIRLINES': 'china-airlines.svg',
    'CHINA EASTERN AIRLINES': 'china-eastern.webp',
    '': 'delta-airlines.png',
    'EASTAR JET': 'e-star.png',
    '': 'hawaiian-airlines.png',
    'HONGKONGEXPRESS': 'hk-express.png',
    '': 'japan-airlines.svg',
    'JEJU AIR': 'jeju-air.png',
    'JINAIR': 'jin-air.png',
    '': 'klm.svg',
    'KOREAN AIR': 'korean-air.webp',
    'PHILIPPINE AIRLINES': 'philippine-airlines.svg',
    'SHANGHAI AIRLINES': 'shanghai-airlines.webp',
    '': 'singapore-airlines.svg',
    '': 'spring-airlines.webp',
    'TIGER AIR TAIWAN': 'tigerair-taiwan.webp',
    "T'WAY AIR CO.LTD": 'tway-air.png',
    'VIETJET AIR': 'vietjet-air.webp',
    'VIETNAM AIRLINES': 'vietnam-airlines.webp',
    'AIR BUSAN' : 'air-busan.jpg' 
  };

  export default airlineDictionary;

  export const getLogo = (airlineName: string): string => {
    return airlineDictionary[airlineName] || 'default-airline.svg';
  };