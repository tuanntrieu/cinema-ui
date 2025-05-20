import { PageRequest } from "../page";

export interface ComboDetailRequest {
    foodId: number;
    quantity: number;
}
export interface ComboRequest {
    name: string;
    price: number;
    comboDetails: ComboDetailRequest[];
}
export interface ComboResponse {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}
export interface ComboSearchRequest extends PageRequest {
    name: string;
}
export interface ComboOrderRequest {
    comboId: number;
    quantity: number;
}
export interface FoodRequest extends PageRequest {
    name: string | null;
}
export interface FoodResponse{
    id:number;
    name:string;
}