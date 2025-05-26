import { PageRequest } from "../page";

export interface CinemaSearchRequest extends PageRequest {
    name: string;
}

export interface CinemaResponse {
  id: number;
  cinemaName: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
  hotline: string;
}
