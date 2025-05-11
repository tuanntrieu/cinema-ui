export interface ScheduleRequest {
    schedule: Date;
    movieId: number;
    roomId: number;
}
export interface ScheduleSearchByCinemaRequest {
    movieId: number;
    cinemaId: number;
}
export interface ScheduleSearchByRoomRequest {
    date: Date;
    movieId: number;
    roomId: number;
}

export interface ScheduleForMoiveByDateRequest {
    date: Date;
    movieId: number;
    cinemaId: number;
}

export interface TimeScheduleDto {
    id: number;
    time: string;
    countSeatAvailable: number;
}

export interface RoomScheduleResponse {
    roomId: number;
    name: string;
    date: Date;
    times: TimeScheduleDto[];
}

export interface ScheduleForCinemaResponse {
    date: Date;
    roomSchedules: RoomScheduleResponse[];
}

export interface ScheduleForRoomResponse {
    startTime: Date;
    endTime: Date;
    movieName: string;
}