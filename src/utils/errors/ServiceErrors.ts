export enum ServiceErrorCode {
    // User-related error codes
    DUPLICATE_EMAIL = 'DUPLICATE_EMAIL',
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    USER_INVALID_DETAILS = 'USER_INVALID_DETAILS',
    
    // OTP-related error codes
    OTP_EXISTS = 'OTP_EXISTS',
    OTP_NOT_FOUND = 'OTP_NOT_FOUND',
    OTP_INVALID_DETAILS = 'OTP_INVALID_DETAILS',
    OTP_EXPIRED = 'OTP_EXPIRED',
    
    // General error codes
    DATABASE_ERROR = 'DATABASE_ERROR',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
    MAIL_ERROR = 'MAIL_ERROR',
    CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
    
    // Hymn-related error codes
    HYMN_NOT_FOUND = 'HYMN_NOT_FOUND',

    //LOCATION errors
    LOCATION_NOT_FOUND = 'LOCATION_NOT_FOUND',
    NO_PARAM_ERROR = 'NO_PARAM_ERROR',

    LIMIT_EXCEEDED = 'LIMIT_EXCEEDED',
}

export class ServiceError extends Error {
    constructor(
        message: string,
        public code: ServiceErrorCode,
        public errCode: number
    ) {
        super(message);
        this.name = 'ServiceError';
    }
}

export const UserServiceError = ServiceError;
export const HymnServiceError = ServiceError;
export const OtpServiceError = ServiceError;