import { SeatStatus, SeatType } from "../../utils/constants";

export interface SeatResponse {
    seatId: number;
    seatName: string;
    seatType: string;
    seatStatus: string;
    xcoordinate: number;
    ycoordinate: number;
    price: number
}
export interface UpdateSeatPriceRequest {
    seatType: SeatType;
    weekDayPrice: number;
    weekendPrice: number;
}
export interface UpdateSeatStatusRequest {
    seatId: number;
    scheduleId: number;
    seatStatus:SeatStatus;
}
