import { Flight } from "./Flight";

export interface StartDataProps {
    displayedFlights: Flight[];
    lastFlightElementRef: (node: HTMLElement | null) => void;
}