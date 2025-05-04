export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    confirmPassword: string;
    fullname: string;
}

export interface TokenRefRequest {
    refreshToken: string;
}

export interface SendOtpRequest {
    email: string;
}
export interface VerifyOtpRequest {
    email: string;
    otp: number;
}

export interface ForgetPassRequest {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface ChangePassRequest {
    email: string;
    oldPassword: string;
    password: string;
    confirmPassword: string;
}

export class CommonResponse<T> {
    status !: string;
    statusCode!: number;
    message!: T;
    data!: T;
}

