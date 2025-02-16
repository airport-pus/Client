interface LogoMapping {
    [key: string]: string;
}

const airlineDictionary: LogoMapping = {
    '': 'air-china.svg',
    '': 'alitalia.svg',
    'ASIANA AIRLINE': 'asiana-air.png',
    '': 'cathay-pacific.png',
    'CHINA AIRLINES': 'china-airlines.png',
    'CHINA EASTERN AIRLINES': 'china-eastern.webp',
    '': 'delta-airlines.png',
    'EASTAR JET': 'eastar-jet.svg',
    '': 'hawaiian-airlines.png',
    'HONGKONGEXPRESS': 'hk-express.png',
    '': 'japan-airlines.svg',
    'JEJU AIR': 'jeju-air.png',
    'JINAIR': 'jin-air.png',
    '': 'klm.svg',
    'KOREAN AIR': 'korean-air.webp',
    'PHILIPPINE AIRLINES': 'philippine-airlines.svg',
    '': 'shanghai-airlines.webp',
    '': 'singapore-airlines.svg',
    '': 'spring-airlines.webp',
    '': 'tigerair-taiwan.webp',
    '': 'tway-air.png',
    'VIETJET AIR': 'vietjet-air.webp',
    'VIETNAM AIRLINES': 'vietnam-airlines.webp'
  };

  export default airlineDictionary;

  export const getLogo = (airlineName: string): string => {
    return airlineDictionary[airlineName] || 'default-airline.svg';
  };