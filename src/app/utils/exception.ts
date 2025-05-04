import { Observable, of } from "rxjs";
import { CommonResponse } from "../models/auth";


export function mapError(error: CommonResponse<string>): Observable<CommonResponse<any>> {

    return of({
        status: error.status,
        statusCode: error.statusCode,
        message: error.message
    } as CommonResponse<any>);
}

