import { Gender } from "../../utils/constants";

export interface CustomerRequest {
    email: string;
    phoneNumber: string;
    fullName:string;
    gender : Gender;
}

export interface Customer {
    id: number;
    fullName: string;
    phoneNumber: string;
    gender: string;
    cinemaPicked: number;
  }
  