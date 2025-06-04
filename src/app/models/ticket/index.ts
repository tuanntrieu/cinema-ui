import { ComboOrderRequest } from "../combo";
import { PageRequest } from "../page";

export interface ComboTicketResponse {
    name: string;
    price: number;
    quantity: number;
}
export interface OrderRequest {
    id: string;
    customerId: number;
    customerName: string;
    customerEmail: string;
    movieId: number;
    scheduleId: number;
    seatId: number[];
    combos: ComboOrderRequest[]
}
export interface TicketRequest extends PageRequest {
    customerId: number;
    dateOrder: Date | null;
}
export interface TicketResponse {
    id: number;
    createdDate: string;
    customerName: string;
    customerEmail: string;
    movieName: string;
    cinemaName: string;
    cinemaAddress: string;
    roomName: string;
    date: Date;
    time: Date;
    seats: string;
    totalSeats: number;
    totalCombos: number;
    combo: ComboTicketResponse[];
}

export interface DataCacheRequest {
    vnp_TxnRef: string;
    customerId: number;
    customerName: string;
    customerEmail: string;
    movieId: number;
    scheduleId: number;
    seatId: number[];
    combos: ComboOrderRequest[]
}
export interface CreateUrlRequest {
    amount: number;
    cancelUrl: string;
    returnUrl: string;

}