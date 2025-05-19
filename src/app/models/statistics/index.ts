import { PageRequest } from "../page";

export interface GeneralStatisticsResponse {
    total: number;
    rate: number;
}
export interface RevenueChartRequest {
    cinemaId: number | null;
    date: Date;
}

export interface RevenueChartResponse {
    label: string;
    countTickets: number;
    total: number;
}
export interface RevenueCinemaRequest extends PageRequest {
    date: Date | null;
}
export interface RevenueCinemaResponse {
    cinemaId: number;
    cinemaName: string;
    sumTickets: number;
    total: number;
}
export interface RevenueMovieRequest extends PageRequest {
    date: Date | null;
    name: string | null;
}
export interface RevenueMovieResponse {
    id: number;
    name: string;
    sumTicket: number;
    totalSeat: number;
}