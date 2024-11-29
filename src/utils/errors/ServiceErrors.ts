
export class UserServiceError extends Error {
    constructor(
        message: string,
        public code: 'DUPLICATE_EMAIL' | 'DATABASE_ERROR' | 'NOT_FOUND' | 'INVALID_DETAILS'
    ) {
        super(message);
        this.name = 'UserServiceError';
    }
}

export class HymnServiceError extends Error {
    constructor(
        message: string,
        public code: 'DATABASE_ERROR' | 'NOT_FOUND'
    ) {
        super(message);
        this.name = 'UserServiceError';
    }
}