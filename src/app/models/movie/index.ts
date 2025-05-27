import { PageRequest } from "../page";

export interface MovieSearchRequest extends PageRequest {
    cinemaId: number;
    dateSearch: Date;
    name: string;
}

export interface MovieRequest {
    name: string;
    actors: string;
    duration: number;
    description: string;
    language: string; f
    isSub: string;
    releaseDate: Date | string;
    endDate: Date | string;
    movieTypeId: number[];
    ageLimit: number;
    trailer: string;
}

export interface MovieResponse {
    id: number;
    name: string;
    actors: string;
    duration: number;
    description: string;
    language: string;
    isSub: string;
    releaseDate: Date;
    endDate: Date;
    type: string;
    ageLimit: number;
    image: string;
    director: string;
    trailer: string;
}
export interface MovieDetailResponse {
    id: number;
    name: string;
    actors: string;
    duration: number;
    description: string;
    language: string;
    isSub: string;
    releaseDate: Date;
    endDate: Date;
    types: MovieType[];
    ageLimit: number;
    trailer: string;
    image: string;
    director: string;
}
export interface MovieType {
    id: number;
    name: string
}
export interface MovieTypeRequest {
    name: string;
}
export interface MovieTypeSearchRequest extends PageRequest {
    name: string | null;
}