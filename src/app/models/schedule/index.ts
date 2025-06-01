export interface ScheduleRequest {
    scheduleTime: Date;
    movieId: number;
    roomId: number;
}
export interface ScheduleSearchByCinemaRequest {
    movieId: number;
    cinemaId: number;
}
export interface ScheduleSearchByRoomRequest {
    date: Date;
    movieId: number | null;
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
    id:number;
    startTime: Date;
    endTime: Date;
    movieName: string;
}