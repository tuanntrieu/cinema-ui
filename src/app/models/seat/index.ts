import { RoomTypeEnum, SeatStatus, SeatType } from "../../utils/constants";

export interface SeatResponse {
    seatId: number;
    seatName: string;
    seatType: string;
    seatStatus: string;
    xcoordinate: number;
    ycoordinate: number;
    price: number
}

export interface UpdateSeatStatusRequest {
    seatId: number;
    scheduleId: number;
    seatStatus:SeatStatus;
}
export interface RoomTypeResponse {
  id: number;
  surcharge: number,
  roomType: RoomTypeEnum
}
export interface SeatPriceResponse {
  id: number,
  weekdayPrice: number,
  weekendPrice: number,
  seatType: SeatType
}

export interface UpdateSeatPriceRequest{
    seatRequest:SeatPriceResponse[];
    roomRequest:RoomTypeResponse[];
}
