export const baseUrl = 'https://783e-222-252-18-10.ngrok-free.app/api/v1';
export const success = 'SUCCESS';
export const error = 'ERROR';

export enum Gender {
    MALE = 'MALE',
    FEMALE = 'FEMALE'
}
export enum RoomTypeEnum {
    _2D = '2D',
    _3D = '3D',
    _4D = '4D',
    _IMAX = 'IMAX',
}

export enum SeatType {
    STANDARD = "Ghế thưởng",
    VIP = "Ghế vip",
    COUPLE = "Ghế đôi"
}
export enum SeatStatus {
    AVAILABLE = "AVAILABLE",
    SOLD = "SOLD",
    MAINTENANCE = "MAINTENANCE",
    HOLDING = "HOLDING",
    SELECTED = "SELECTED"
}