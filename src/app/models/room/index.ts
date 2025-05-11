import { RoomTypeEnum } from "../../utils/constants";
import { SeatResponse } from "../seat";

export interface RoomRequest {
    name: string;
    numberOfRow: number;
    numberOfColumn: number;
    cinemaId: number;
    roomTypeEnum: RoomTypeEnum;
}

export interface UpdateRoomSurchargeRequest {
    roomType: RoomTypeEnum;
    surcharge: number;
}
export interface RoomOrderResponse {
    roomId: number;
    roomName: string;
    roomType: string;
    cinemaId: number;
    cinemaName: string;
    movieId: number;
    movieName: string;
    movieImageUrl: string;
    language: string;
    movieType: string;
    duration: number;
    date: Date;
    time: Date;
    ageLimit: number;
    seats: SeatResponse[];
}