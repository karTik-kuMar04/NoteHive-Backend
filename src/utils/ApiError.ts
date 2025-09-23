class API_ERROR extends Error {
    statusCode: number;
    data: any | null;
    success: boolean;
    error: any;

    constructor(
        statusCode: number,
        message: string = 'Something went wrong',
        error: any,
        stack?: string
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.success = false;
        this.error = error;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}


export default API_ERROR;