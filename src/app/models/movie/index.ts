import { PageRequest } from "../page";

export interface MovieSearchRequest extends PageRequest {
    cinemaId: number;
    dateSearch: Date;
}

export interface MovieRequest {
    name: string;
    actors: string;
    duration: number;
    description: string;
    language: string;
    isSub: string;
    releaseDate: Date;
    endDate: Date;
    movieTypeId: number[];
    ageLimit: number;
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
}