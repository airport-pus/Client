export interface FlightData {
    flightNumber: string;
    airlineEnglish: string;
    airlineKorean: string;
    arrivedEng: string;
    arrivedKor: string;
    gate: string;
    boardingEng: string;
    boardingKor: string;
    std: string | null;
    etd: string | null;
    io: string;
    line: string;
    remarkEng: string;
    remarkKor: string;
}