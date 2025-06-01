import { Gender } from "../../utils/constants";
import { PageRequest } from "../page";

export interface CustomerRequest {
    email: string;
    phoneNumber: string;
    fullName: string;
    gender: Gender;
}

export interface Customer {
    id: number;
    fullName: string;
    phoneNumber: string;
    gender: string;
    cinemaPicked: number;
}
export interface CustomerSearchRequest extends PageRequest {
    name: string;
}
export interface CustomerResponse {
    id: number;
    name: string;
    email: string;
    phone: string;
    gender: string;
    createdAt: Date;
    countTickets: number;
    isLocked: boolean;
}