interface LogoMapping {
    [key: string]: string;
}

const airlineDictionary: LogoMapping = {
    'AIR INTERNATIONAL CHINA': 'air-china.svg',
    '': 'alitalia.svg',
    'ASIANA AIRLINE': 'asiana-air.png',
    'CATHAY PACIFIC AIRWAYS': 'cathay-pacific2.png',
    'CHINA AIRLINES': 'china.jpg',
    'CHINA EASTERN AIRLINES': 'china-eastern.png',
    'DELTA AIRLINES': 'delta.png',
    'EASTAR JET': 'e-star.png',
    'HAWAIIAN AIRLINES': 'hawaiian-airline.png',
    'HONGKONGEXPRESS': 'hkexpress.png',
    'JAPAN AIRLINES': 'japan-airlines.svg',
    'JEJU AIR': 'jeju-air.png',
    'JINAIR': 'jin-air.png',
    'KLM ROYAL DUTCH AIRLINES': 'klm.svg',
    'KOREAN AIR': 'korean-air.webp',
    'PHILIPPINE AIRLINES': 'philippine-airlines.svg',
    'SHANGHAI AIRLINES': 'shanghai-airlines.webp',
    '': 'singapore-airlines.svg',
    'SPRING AIRLINES': 'spring-airlines.webp',
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